import React, { useState } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import { Title, FAB, TextInput, Card, Paragraph, SegmentedButtons, Menu, Divider, Checkbox } from 'react-native-paper';
import { useProject, Ticket } from '../context/ProjectContext';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from '../styles/ProjectDetailsScreen.styles';
import { Header, GenericModal, AnimatedView, BackButton, ContextMenu } from '../components';

interface ProjectDetailsScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');

export const ProjectDetailsScreen: React.FC<ProjectDetailsScreenProps> = ({ navigation, route }) => {
  const { project } = route.params;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketAssignee, setTicketAssignee] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [loading, setLoading] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<{id: string, name: string} | null>(null);
  const [activeTab, setActiveTab] = useState('todo');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
  const { getTicketsByProject, createTicket, updateTicket, loading: ticketsLoading, projectUsers } = useProject();

  const tickets = getTicketsByProject(project.id);
  const todoTickets = tickets.filter(ticket => ticket.status === 'todo');
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress');
  const doneTickets = tickets.filter(ticket => ticket.status === 'done');
  
  // Dictionnaire pour les statistiques
  const PROJECT_STATS = [
    { key: 'total', label: 'Total', value: tickets.length },
    { key: 'todo', label: 'À faire', value: todoTickets.length },
    { key: 'in-progress', label: 'En cours', value: inProgressTickets.length },
    { key: 'done', label: 'Terminés', value: doneTickets.length },
  ];
  
  // Obtenir les membres du projet
  const projectMembers = projectUsers.filter(user => project.members.includes(user.id));

  const handleCreateTicket = async () => {
    if (!ticketTitle.trim()) {
      return;
    }

    setLoading(true);
    try {
      if (editingTicket) {
        // Mode édition
        await updateTicket(editingTicket.id, {
          title: ticketTitle.trim(),
          description: ticketDescription.trim(),
          assignee: selectedAssignee?.id || undefined,
          priority: ticketPriority,
        });
        Alert.alert('Succès', 'Ticket modifié avec succès');
      } else {
        // Mode création
      await createTicket({
        title: ticketTitle.trim(),
        description: ticketDescription.trim(),
        status: 'todo',
        projectId: project.id,
        priority: ticketPriority,
        tags: [],
        assignee: selectedAssignee?.id || undefined,
      });
      }
      setTicketTitle('');
      setTicketDescription('');
      setTicketAssignee('');
      setSelectedAssignee(null);
      setTicketPriority('medium');
      setEditingTicket(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating/updating ticket:', error);
      Alert.alert('Erreur', editingTicket ? 'Impossible de modifier le ticket' : 'Impossible de créer le ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketMove = async (ticket: Ticket, newStatus: 'todo' | 'in-progress' | 'done') => {
    try {
      await updateTicket(ticket.id, { status: newStatus });
    } catch (error) {
      console.error('Error moving ticket:', error);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setTicketTitle(ticket.title);
    setTicketDescription(ticket.description);
    setTicketPriority(ticket.priority);
    setTicketAssignee(ticket.assignee || '');
    setSelectedAssignee(ticket.assignee ? projectMembers.find(m => m.id === ticket.assignee) ? { id: ticket.assignee, name: projectMembers.find(m => m.id === ticket.assignee)!.displayName } : null : null);
    setShowCreateModal(true);
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setTicketTitle('');
    setTicketDescription('');
    setTicketAssignee('');
    setSelectedAssignee(null);
    setTicketPriority('medium');
    setShowCreateModal(false);
  };

  const renderTicket = (ticket: Ticket) => {
    const statusConfig = getStatusConfig(ticket.status);
    const priorityConfig = getPriorityConfig(ticket.priority);
    
    return (
      <Card key={ticket.id} style={styles.ticketCard}>
        <Card.Content>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              {ticket.description && (
                <Text style={styles.ticketDescription}>{ticket.description}</Text>
              )}
            </View>
            <View style={styles.ticketHeaderRight}>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                <Text style={styles.statusText}>{statusConfig.label}</Text>
            </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTicket(ticket)}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.ticketFooter}>
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Priorité:</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.color }]}>
                <Text style={styles.priorityText}>{priorityConfig.label}</Text>
              </View>
          </View>
            
            {ticket.assignee && (
            <View style={styles.assigneeContainer}>
              <Text style={styles.assigneeLabel}>Assigné à:</Text>
                <Text style={styles.assigneeText}>
                  {getAssigneeName(ticket.assignee)}
                </Text>
            </View>
          )}
        </View>
        </Card.Content>
      </Card>
    );
  };

  // Dictionnaires pour éviter la redondance
  const STATUS_CONFIG = {
    todo: {
      label: 'À faire',
      color: colors.warning,
      icon: 'clipboard-outline',
      nextStatus: 'in-progress',
      nextLabel: '→ En cours',
      prevStatus: null,
      prevLabel: null,
    },
    'in-progress': {
      label: 'En cours',
      color: colors.info,
      icon: 'clock-outline',
      nextStatus: 'done',
      nextLabel: 'Terminé →',
      prevStatus: 'todo',
      prevLabel: '← À faire',
    },
    done: {
      label: 'Terminé',
      color: colors.success,
      icon: 'check-circle-outline',
      nextStatus: null,
      nextLabel: null,
      prevStatus: 'in-progress',
      prevLabel: '← En cours',
    },
  };

  const PRIORITY_CONFIG = {
    low: { label: 'Faible', color: colors.success },
    medium: { label: 'Moyenne', color: colors.warning },
    high: { label: 'Élevée', color: colors.error },
    urgent: { label: 'Urgente', color: colors.primary },
  };

  const getStatusConfig = (status: string) => STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { label: status, color: colors.textSecondary };
  const getPriorityConfig = (priority: string) => PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || { label: priority, color: colors.textSecondary };
  
  // Fonction utilitaire pour obtenir le nom de l'assigné
  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Non assigné';
    return projectMembers.find(m => m.id === assigneeId)?.displayName || 'Inconnu';
  };

  // Fonction générique pour rendre le contenu d'un onglet
  const renderTabContent = (status: string, tickets: Ticket[]) => {
    const statusConfig = getStatusConfig(status);
    
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.pageTitle}>Tickets {statusConfig.label.toLowerCase()}</Text>
        <ScrollView 
          style={styles.ticketsList}
          showsVerticalScrollIndicator={false}
        >
          {tickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketItem}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              {ticket.description && (
                <Text style={styles.ticketDescription}>{ticket.description}</Text>
              )}
              <View style={styles.ticketFooter}>
                <Text style={styles.ticketAssignee}>
                  {getAssigneeName(ticket.assignee)}
                </Text>
                <View style={styles.ticketActions}>
                  {statusConfig.prevStatus && statusConfig.prevLabel && (
                    <TouchableOpacity
                      style={[styles.moveButton, styles.moveBackButton]}
                      onPress={() => handleTicketMove(ticket, statusConfig.prevStatus as 'todo' | 'in-progress' | 'done')}
                    >
                      <Text style={styles.moveButtonText}>{statusConfig.prevLabel}</Text>
                    </TouchableOpacity>
                  )}
                  {statusConfig.nextStatus && statusConfig.nextLabel && (
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => handleTicketMove(ticket, statusConfig.nextStatus as 'todo' | 'in-progress' | 'done')}
                    >
                      <Text style={styles.moveButtonText}>{statusConfig.nextLabel}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
      </View>
          ))}
        </ScrollView>
    </View>
  );
  };

  if (ticketsLoading) {
    return (
      <View style={sharedStyles.container}>
        <Header 
          title={project.name}
          subtitle="Gestion des tickets"
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
      <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement des tickets...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={sharedStyles.container}>
      <Header 
        title={project.name}
        subtitle="Gestion des tickets"
              rightElement={
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.teamButton}
                    onPress={() => navigation.navigate('TeamManagement', { projectId: project.id })}
                  >
                    <Text style={styles.teamButtonText}>👥 Équipe</Text>
                  </TouchableOpacity>
                  <BackButton onPress={() => navigation.goBack()} />
                </View>
              }
      />

      <ScrollView style={styles.content}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectDescription}>{project.description}</Text>
          <View style={styles.statsContainer}>
            {PROJECT_STATS.map((stat) => (
              <View key={stat.key} style={styles.statItem}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            ))}
          </View>
        </View>

        {/* Onglets */}
        <View style={styles.tabsContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={Object.entries(STATUS_CONFIG).map(([key, config]) => ({
              value: key,
              label: config.label,
              icon: config.icon,
            }))}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Contenu des onglets */}
        <View style={styles.tabContent}>
          {activeTab === 'todo' && renderTabContent('todo', todoTickets)}
          {activeTab === 'in-progress' && renderTabContent('in-progress', inProgressTickets)}
          {activeTab === 'done' && renderTabContent('done', doneTickets)}
                </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        label="Nouveau ticket"
        color="white"
      />

      <GenericModal
          visible={showCreateModal}
        onDismiss={handleCancelEdit}
        title={editingTicket ? 'Modifier le ticket' : 'Nouveau Ticket'}
        icon={editingTicket ? '✏️' : '🎫'}
        primaryButtonText={editingTicket ? 'Modifier' : 'Créer'}
        onPrimaryPress={handleCreateTicket}
        onSecondaryPress={handleCancelEdit}
        loading={loading}
        disabled={!ticketTitle.trim()}
        primaryIcon={editingTicket ? "check" : "plus"}
      >
          <TextInput
            label="Titre du ticket"
            value={ticketTitle}
            onChangeText={setTicketTitle}
            mode="outlined"
            style={sharedStyles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="ticket-outline" />}
          />
          
          <TextInput
            label="Description (optionnel)"
            value={ticketDescription}
            onChangeText={setTicketDescription}
            mode="outlined"
            style={sharedStyles.input}
            multiline
            numberOfLines={3}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="text" />}
          />
          
          <View style={styles.modalAssigneeContainer}>
          <Text style={styles.modalAssigneeLabel}>Assigné à (optionnel)</Text>
            <Menu
              visible={showAssigneeMenu}
              onDismiss={() => setShowAssigneeMenu(false)}
              anchor={
                <TouchableOpacity
                  style={styles.assigneeButton}
                  onPress={() => setShowAssigneeMenu(true)}
                >
                <Text style={styles.assigneeButtonText}>
                    {selectedAssignee ? selectedAssignee.name : 'Sélectionner un membre'}
                  </Text>
                  <Text style={styles.assigneeArrow}>▼</Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSelectedAssignee(null);
                  setShowAssigneeMenu(false);
                }}
                title="Aucun assigné"
              />
              {projectMembers.map((member) => (
                <Menu.Item
                  key={member.id}
                  onPress={() => {
                  setSelectedAssignee({ id: member.id, name: member.displayName });
                    setShowAssigneeMenu(false);
                  }}
                title={member.displayName}
                />
              ))}
            </Menu>
          </View>
          
          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priorité</Text>
          <View style={styles.priorityCheckboxes}>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <View key={key} style={styles.priorityCheckboxItem}>
                <Checkbox
                  status={ticketPriority === key ? 'checked' : 'unchecked'}
                  onPress={() => setTicketPriority(key as 'low' | 'medium' | 'high' | 'urgent')}
                  color={config.color}
                />
                <Text style={[
                  styles.priorityCheckboxText,
                  { color: config.color }
                ]}>
                  {config.label}
                </Text>
              </View>
            ))}
          </View>
            </View>
      </GenericModal>
          </View>
  );
};