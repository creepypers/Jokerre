import React, { useState } from 'react';
import { View, ScrollView, Dimensions, Animated, TouchableOpacity, Text, Alert } from 'react-native';
import { Title, FAB, Portal, Modal, TextInput, Button, ActivityIndicator, Card, Paragraph, SegmentedButtons, Menu, Divider } from 'react-native-paper';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useProject, Ticket } from '../context/ProjectContext';
import { sharedStyles } from '../styles/shared.styles';
import { colors } from '../utils/colors';
import { styles } from '../styles/ProjectDetailsScreen.styles';

interface ProjectDetailsScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3 - 20;

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [activeTab, setActiveTab] = useState('todo');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
  const { getTicketsByProject, createTicket, updateTicket, loading: ticketsLoading, projectUsers } = useProject();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const tickets = getTicketsByProject(project.id);
  const todoTickets = tickets.filter(ticket => ticket.status === 'todo');
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress');
  const doneTickets = tickets.filter(ticket => ticket.status === 'done');
  
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
      console.error('Error updating ticket:', error);
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

  const renderTicket = ({ item, drag, isActive }: RenderItemParams<Ticket>) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          sharedStyles.card,
          styles.ticketCard,
          isActive && styles.draggingCard,
        ]}
      onLongPress={drag}
      disabled={isActive}
        activeOpacity={0.8}
      >
        <View style={sharedStyles.cardContent}>
          <View style={styles.ticketHeader}>
            <Text style={[sharedStyles.title, styles.ticketTitle]}>{item.title}</Text>
            <View style={styles.ticketHeaderRight}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTicket(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        {item.description && (
            <Text style={[sharedStyles.body, styles.ticketDescription]}>
              {item.description}
            </Text>
        )}
        {item.assignee && (
            <View style={styles.assigneeContainer}>
              <Text style={styles.assigneeLabel}>Assigné à:</Text>
              <Text style={styles.assigneeText}>{item.assignee}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#FDE68A';
      case 'in-progress': return '#F97316';
      case 'done': return '#16A34A';
      default: return colors.background;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'À faire';
      case 'in-progress': return 'En cours';
      case 'done': return 'Terminé';
      default: return status;
    }
  };

  const renderColumn = (title: string, tickets: Ticket[], status: 'todo' | 'in-progress' | 'done', color: string) => (
    <Animated.View 
      style={[
        styles.column, 
        { 
          backgroundColor: color,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={styles.columnBadge}>
          <Text style={styles.columnCount}>{tickets.length}</Text>
        </View>
      </View>
      
      <DraggableFlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          data.forEach(ticket => {
            if (ticket.status !== status) {
              handleTicketMove(ticket, status);
            }
          });
        }}
        style={styles.ticketList}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );

  if (ticketsLoading) {
    return (
      <View style={sharedStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[sharedStyles.body, { marginTop: 16 }]}>Chargement des tickets...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={sharedStyles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header simple */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.name}</Text>
            {project.description && (
              <Text style={styles.projectDescription}>{project.description}</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.teamButton} 
              onPress={() => navigation.navigate('TeamManagement', { projectId: project.id })}
            >
              <Text style={styles.teamButtonText}>👥 Équipe</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Retour</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques du projet */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tickets.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todoTickets.length}</Text>
            <Text style={styles.statLabel}>À faire</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{inProgressTickets.length}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{doneTickets.length}</Text>
            <Text style={styles.statLabel}>Terminé</Text>
          </View>
        </View>
      </Animated.View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            {
              value: 'todo',
              label: 'À faire',
              icon: 'clipboard-outline',
            },
            {
              value: 'in-progress',
              label: 'En cours',
              icon: 'clock-outline',
            },
            {
              value: 'done',
              label: 'Terminé',
              icon: 'check-circle-outline',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Contenu des onglets */}
      <View style={styles.tabContent}>
        {activeTab === 'todo' && (
          <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>Tickets à faire</Text>
            <ScrollView 
              style={styles.ticketsList}
              showsVerticalScrollIndicator={false}
            >
              {todoTickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketItem}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  {ticket.description && (
                    <Text style={styles.ticketDescription}>{ticket.description}</Text>
                  )}
                  <View style={styles.ticketFooter}>
                    <Text style={styles.ticketAssignee}>
                      {ticket.assignee || 'Non assigné'}
                    </Text>
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => updateTicket(ticket.id, { ...ticket, status: 'in-progress' })}
                    >
                      <Text style={styles.moveButtonText}>→ En cours</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'in-progress' && (
          <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>Tickets en cours</Text>
            <ScrollView 
              style={styles.ticketsList}
              showsVerticalScrollIndicator={false}
            >
              {inProgressTickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketItem}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  {ticket.description && (
                    <Text style={styles.ticketDescription}>{ticket.description}</Text>
                  )}
                  <View style={styles.ticketFooter}>
                    <Text style={styles.ticketAssignee}>
                      {ticket.assignee || 'Non assigné'}
                    </Text>
                    <View style={styles.ticketActions}>
                      <TouchableOpacity
                        style={[styles.moveButton, styles.moveBackButton]}
                        onPress={() => updateTicket(ticket.id, { ...ticket, status: 'todo' })}
                      >
                        <Text style={styles.moveButtonText}>← À faire</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.moveButton}
                        onPress={() => updateTicket(ticket.id, { ...ticket, status: 'done' })}
                      >
                        <Text style={styles.moveButtonText}>Terminé →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'done' && (
          <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>Tickets terminés</Text>
            <ScrollView 
              style={styles.ticketsList}
              showsVerticalScrollIndicator={false}
            >
              {doneTickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketItem}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>
                  {ticket.description && (
                    <Text style={styles.ticketDescription}>{ticket.description}</Text>
                  )}
                  <View style={styles.ticketFooter}>
                    <Text style={styles.ticketAssignee}>
                      {ticket.assignee || 'Non assigné'}
                    </Text>
                    <TouchableOpacity
                      style={[styles.moveButton, styles.moveBackButton]}
                      onPress={() => updateTicket(ticket.id, { ...ticket, status: 'in-progress' })}
                    >
                      <Text style={styles.moveButtonText}>← En cours</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
      </ScrollView>
          </View>
        )}
      </View>

      <FAB
        icon="plus"
        style={[sharedStyles.fab, styles.customFab]}
        onPress={() => setShowCreateModal(true)}
        label="Nouveau ticket"
        color="white"
      />

      <Portal>
        <Modal
          visible={showCreateModal}
          onDismiss={handleCancelEdit}
          contentContainerStyle={sharedStyles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{editingTicket ? '✏️' : '🎫'}</Text>
            <Text style={sharedStyles.modalTitle}>{editingTicket ? 'Modifier le ticket' : 'Nouveau Ticket'}</Text>
          </View>
          
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
          
          <View style={styles.assigneeContainer}>
            <Text style={styles.assigneeLabel}>Assigner à (optionnel)</Text>
            <Menu
              visible={showAssigneeMenu}
              onDismiss={() => setShowAssigneeMenu(false)}
              anchor={
                <TouchableOpacity
                  style={styles.assigneeButton}
                  onPress={() => setShowAssigneeMenu(true)}
                >
                  <Text style={[
                    styles.assigneeButtonText,
                    !selectedAssignee && styles.assigneePlaceholder
                  ]}>
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
              <Divider />
              {projectMembers.map((member) => (
                <Menu.Item
                  key={member.id}
                  onPress={() => {
                    setSelectedAssignee({ id: member.id, name: member.displayName || member.email });
                    setShowAssigneeMenu(false);
                  }}
                  title={member.displayName || member.email}
                />
              ))}
            </Menu>
          </View>
          
          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priorité</Text>
            <View style={styles.priorityButtons}>
              {[
                { value: 'low', label: 'Faible', color: colors.sageGreen },
                { value: 'medium', label: 'Moyenne', color: colors.primary },
                { value: 'high', label: 'Élevée', color: '#F59E0B' },
                { value: 'urgent', label: 'Urgente', color: '#EF4444' },
              ].map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityButton,
                    { borderColor: priority.color },
                    ticketPriority === priority.value && { backgroundColor: priority.color }
                  ]}
                  onPress={() => setTicketPriority(priority.value as any)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    { color: ticketPriority === priority.value ? 'white' : priority.color }
                  ]}>
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={sharedStyles.modalButtons}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              style={[sharedStyles.modalButton, sharedStyles.secondaryButton]}
              labelStyle={sharedStyles.secondaryButtonText}
              icon="close"
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateTicket}
              style={[sharedStyles.modalButton, sharedStyles.primaryButton]}
              labelStyle={sharedStyles.primaryButtonText}
              disabled={loading || !ticketTitle.trim()}
              icon={loading ? undefined : (editingTicket ? "check" : "plus")}
            >
              {loading ? <ActivityIndicator color="white" size="small" /> : (editingTicket ? 'Modifier' : 'Créer')}
            </Button>
          </View>
        </Modal>
      </Portal>

     
      
    </ScrollView>
  );
};

