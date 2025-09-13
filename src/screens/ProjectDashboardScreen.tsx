import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Icon, Chip, ProgressBar } from 'react-native-paper';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { useProject, Ticket, User } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { sharedStyles } from '../styles/shared.styles';
import { styles } from '../styles/ProjectDashboardScreen.styles';
import { Header, BackButton, AnimatedView } from '../components';

export const ProjectDashboardScreen: React.FC<any> = ({ navigation, route }) => {
  const { project } = route.params;
  const { user } = useAuth();
  const { projectUsers, getTicketsByProject, teamGroups } = useProject();
  
  const [projectTickets, setProjectTickets] = useState<Ticket[]>([]);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [projectGroups, setProjectGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = () => {
      try {
        // Charger les tickets du projet
        const tickets = getTicketsByProject(project.id);
        setProjectTickets(tickets);

        // Charger les membres du projet
        const members = projectUsers.filter(u => project.members.includes(u.id));
        setProjectMembers(members);

        // Charger les groupes du projet
        const groups = teamGroups.filter(g => project.teamGroups.includes(g.id));
        setProjectGroups(groups);

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données du projet:', error);
        setLoading(false);
      }
    };

    loadProjectData();
  }, [project.id, getTicketsByProject, projectUsers, teamGroups, project.members, project.teamGroups]);

  // Vérifier si l'utilisateur est le créateur du projet
  const isCreator = user?.uid === project.createdBy;

  // Calculer les statistiques des tickets
  const ticketStats = {
    total: projectTickets.length,
    completed: projectTickets.filter(t => t.status === 'done').length,
    inProgress: projectTickets.filter(t => t.status === 'in-progress').length,
    pending: projectTickets.filter(t => t.status === 'todo').length,
    high: projectTickets.filter(t => t.priority === 'high').length,
    medium: projectTickets.filter(t => t.priority === 'medium').length,
    low: projectTickets.filter(t => t.priority === 'low').length,
    emergency : projectTickets.filter(t => t.priority === 'urgent').length
  };

  // Calculer le pourcentage de completion
  const completionPercentage = ticketStats.total > 0 ? (ticketStats.completed / ticketStats.total) * 100 : 0;

  // Calculer les statistiques des membres
  const memberStats = {
    total: projectMembers.length,
    active: projectMembers.length,
    inactive: 0,
  };

  // Calculer les tickets par membre
  const ticketsByMember = projectMembers.map(member => {
    const memberTickets = projectTickets.filter(t => t.assignee === member.id);
    return {
      member,
      total: memberTickets.length,
      completed: memberTickets.filter(t => t.status === 'done').length,
      inProgress: memberTickets.filter(t => t.status === 'in-progress').length,
      pending: memberTickets.filter(t => t.status === 'todo').length,
    };
  });

  // Calculer les tickets par groupe
  const ticketsByGroup = projectGroups.map(group => {
    const groupMembers = projectMembers.filter(m => group.members.includes(m.id));
    const groupTickets = projectTickets.filter(t => 
      groupMembers.some(m => m.id === t.assignee)
    );
    return {
      group,
      total: groupTickets.length,
      completed: groupTickets.filter(t => t.status === 'done').length,
    };
  });

  // Calculer les tickets par priorité
  const priorityStats = {
    emergency: ticketStats.emergency,
    high: ticketStats.high,
    medium: ticketStats.medium,
    low: ticketStats.low,

  };

  // Calculer les tickets par statut
  const statusStats = {
    completed: ticketStats.completed,
    inProgress: ticketStats.inProgress,
    pending: ticketStats.pending,
  };

  // Données pour les graphiques
  const screenWidth = Dimensions.get('window').width - 32;

  // Graphique en secteurs pour les statuts
  const statusChartData = [
    {
      name: 'Terminés',
      population: statusStats.completed,
      color: colors.success,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: 'En cours',
      population: statusStats.inProgress,
      color: colors.warning,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: 'En attente',
      population: statusStats.pending,
      color: colors.textSecondary,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
  ];

  // Graphique en barres pour les priorités
  const priorityChartData = {
    labels: ["Urgente",'Haute', 'Moyenne', 'Basse'],
    datasets: [
      {
        data: [priorityStats.emergency,priorityStats.high, priorityStats.medium, priorityStats.low],
        color: (opacity = 1) => `rgba(217, 119, 6, ${opacity})`, // colors.primary
      },
    ],
  };

  // Graphique linéaire pour la progression dans le temps (simulation)
  const progressionChartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        data: [0, 25, 50, completionPercentage],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // colors.success
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(217, 119, 6, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  if (loading) {
    return (
      <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Tableau de bord"
          subtitle={project.name}
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={sharedStyles.loadingContainer}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>Chargement des données...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isCreator) {
    return (
      <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Accès refusé"
          subtitle={project.name}
          rightElement={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View style={styles.accessDeniedContainer}>
          <Icon source="lock" size={64} color={colors.textSecondary} />
          <Text style={styles.accessDeniedTitle}>Accès refusé</Text>
          <Text style={styles.accessDeniedText}>
            Seul le créateur du projet peut accéder au tableau de bord.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[sharedStyles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Tableau de bord"
        subtitle={project.name}
        rightElement={<BackButton onPress={() => navigation.goBack()} />}
      />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Vue d'ensemble */}
        <AnimatedView animationType="fade" delay={0}>
          <Card style={styles.overviewCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Vue d'ensemble</Title>
              <View style={styles.overviewStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{ticketStats.total}</Text>
                  <Text style={styles.statLabel}>Tickets</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{memberStats.total}</Text>
                  <Text style={styles.statLabel}>Membres</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{projectGroups.length}</Text>
                  <Text style={styles.statLabel}>Groupes</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </AnimatedView>

        {/* Progression du projet */}
        <AnimatedView animationType="fade" delay={100}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Progression du projet</Title>
              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {ticketStats.completed} / {ticketStats.total} tickets terminés
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {completionPercentage.toFixed(1)}%
                  </Text>
                </View>
                <ProgressBar 
                  progress={completionPercentage / 100} 
                  color={colors.primary}
                  style={styles.progressBar}
                />
              </View>
            </Card.Content>
          </Card>
        </AnimatedView>

        {/* Graphique en secteurs - Statuts */}
        <AnimatedView animationType="fade" delay={200}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Répartition par statut</Title>
              {ticketStats.total > 0 ? (
                <PieChart
                  data={statusChartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 10]}
                  absolute
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Aucun ticket à afficher</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </AnimatedView>

        {/* Graphique en barres - Priorités */}
        <AnimatedView animationType="fade" delay={250}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Répartition par priorité</Title>
              {ticketStats.total > 0 ? (
                <BarChart
                  data={priorityChartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  showValuesOnTopOfBars
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>Aucun ticket à afficher</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </AnimatedView>

        {/* Graphique linéaire - Progression */}
        <AnimatedView animationType="fade" delay={300}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Progression du projet</Title>
              <LineChart
                data={progressionChartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        </AnimatedView>


        {/* Performance des membres */}
        <AnimatedView animationType="fade" delay={350}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Performance des membres</Title>
              {ticketsByMember.map((memberData, index) => (
                <View key={memberData.member.id} style={styles.memberPerformance}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {memberData.member.displayName || memberData.member.email}
                    </Text>
                    <Text style={styles.memberTickets}>
                      {memberData.total} ticket{memberData.total > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.memberStats}>
                    <View style={styles.memberStatItem}>
                      <Text style={[styles.memberStatNumber, { color: colors.success }]}>
                        {memberData.completed}
                      </Text>
                      <Text style={styles.memberStatLabel}>Terminés</Text>
                    </View>
                    <View style={styles.memberStatItem}>
                      <Text style={[styles.memberStatNumber, { color: colors.warning }]}>
                        {memberData.inProgress}
                      </Text>
                      <Text style={styles.memberStatLabel}>En cours</Text>
                    </View>
                    <View style={styles.memberStatItem}>
                      <Text style={[styles.memberStatNumber, { color: colors.textSecondary }]}>
                        {memberData.pending}
                      </Text>
                      <Text style={styles.memberStatLabel}>En attente</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </AnimatedView>

        {/* Performance des groupes */}
        {projectGroups.length > 0 && (
          <AnimatedView animationType="fade" delay={400}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Performance des groupes</Title>
                {ticketsByGroup.map((groupData, index) => (
                  <View key={groupData.group.id} style={styles.groupPerformance}>
                    <View style={styles.groupInfo}>
                      <View style={[styles.groupColor, { backgroundColor: groupData.group.color }]} />
                      <Text style={styles.groupName}>{groupData.group.name}</Text>
                    </View>
                    <View style={styles.groupStats}>
                      <Text style={styles.groupTotal}>{groupData.total} tickets</Text>
                      <Text style={styles.groupCompleted}>
                        {groupData.completed} terminés
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </AnimatedView>
        )}

        {/* Informations du projet */}
        <AnimatedView animationType="fade" delay={450}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Informations du projet</Title>
              <View style={styles.projectInfo}>
                <View style={styles.infoItem}>
                  <Icon source="calendar" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Créé le :</Text>
                  <Text style={styles.infoValue}>
                    {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                {project.updatedAt && (
                  <View style={styles.infoItem}>
                    <Icon source="update" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoLabel}>Modifié le :</Text>
                    <Text style={styles.infoValue}>
                      {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                )}
                <View style={styles.infoItem}>
                  <Icon source="account-group" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Membres actifs :</Text>
                  <Text style={styles.infoValue}>{memberStats.active}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </AnimatedView>
      </ScrollView>
    </SafeAreaView>
  );
};
