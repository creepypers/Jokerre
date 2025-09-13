import React, { useState } from "react";
import { View, ScrollView, Alert, SafeAreaView, FlatList } from "react-native";
import {
  Title,
  FAB,
  Card,
  Paragraph,
  Button,
  Chip,
  Text,
} from "react-native-paper";
import { useProject } from "../context/ProjectContext";
import { sharedStyles } from "../styles/shared.styles";
import { colors } from "../utils/colors";
import { styles } from "../styles/InvitationsScreen.styles";
import { Header, BackButton, CompactFilters } from "../components";

interface InvitationsScreenProps {
  navigation: any;
}

export const InvitationsScreen: React.FC<InvitationsScreenProps> = ({
  navigation,
}) => {
  const {
    invitations,
    acceptInvitation,
    declineInvitation,
    deleteInvitation,
    getPendingInvitations,
    loading,
  } = useProject();

  // Filtres pour les invitations
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [processingInvitation, setProcessingInvitation] = useState<
    string | null
  >(null);

  // Utiliser toutes les invitations au lieu de seulement les pending
  const allInvitations = invitations;

  // Appliquer les filtres
  const filteredInvitations = allInvitations.filter((invitation) => {
    const statusMatch =
      statusFilter === "all" || invitation.status === statusFilter;
    const typeMatch = typeFilter === "all" || invitation.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const pendingInvitations = filteredInvitations;

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      console.log("InvitationsScreen - Accepting invitation:", invitationId);
      await acceptInvitation(invitationId);
      console.log("InvitationsScreen - Invitation accepted successfully");
      Alert.alert("Succès", "Invitation acceptée avec succès !");
    } catch (error: any) {
      console.error("InvitationsScreen - Error accepting invitation:", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'accepter l'invitation"
      );
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      await declineInvitation(invitationId);
      Alert.alert("Succès", "Invitation refusée");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de refuser l'invitation"
      );
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId);
    try {
      await deleteInvitation(invitationId);
      Alert.alert("Succès", "Invitation supprimée");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de supprimer l'invitation"
      );
    } finally {
      setProcessingInvitation(null);
    }
  };

  // Fonctions utilitaires pour les invitations
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "accepted":
        return colors.success;
      case "declined":
        return colors.error;
      case "expired":
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "declined":
        return "Refusée";
      case "expired":
        return "Expirée";
      default:
        return status;
    }
  };

  const isExpired = (invitation: any) => {
    return invitation.expiresAt < new Date();
  };

  const renderInvitation = ({ item: invitation }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.invitationHeader}>
          <Title style={styles.invitationTitle}>
            Invitation{" "}
            {invitation.type === "project" ? "au projet" : "au groupe"}
          </Title>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(invitation.status) },
            ]}
            textStyle={styles.statusText}
          >
            {getStatusText(invitation.status)}
          </Chip>
        </View>

        <Paragraph style={styles.message}>{invitation.message}</Paragraph>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            Type: {invitation.type === "project" ? "Projet" : "Groupe"}
          </Text>
          <Text style={styles.detailText}>
            Expire le: {invitation.expiresAt.toLocaleDateString()}
          </Text>
        </View>

        {invitation.status === "pending" && !isExpired(invitation) && (
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => handleDeclineInvitation(invitation.id)}
              style={styles.button}
              disabled={loading || processingInvitation !== null}
            >
              Refuser
            </Button>
            <Button
              mode="contained"
              onPress={() => handleAcceptInvitation(invitation.id)}
              style={[styles.button, styles.acceptButton]}
              disabled={loading || processingInvitation !== null}
            >
              Accepter
            </Button>
          </View>
        )}

        {(invitation.status === "accepted" ||
          invitation.status === "declined" ||
          invitation.status === "expired") && (
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => handleDeleteInvitation(invitation.id)}
              style={[styles.button, { borderColor: colors.error }]}
              disabled={loading || processingInvitation !== null}
              textColor={colors.error}
            >
              Supprimer
            </Button>
          </View>
        )}

        {isExpired(invitation) && invitation.status === "pending" && (
          <Text style={styles.expiredText}>Cette invitation a expiré</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[sharedStyles.container, { backgroundColor: colors.background }]}
    >
      <Header
        title="Invitations"
        subtitle="Gérer vos invitations en attente"
        rightElement={<BackButton onPress={() => navigation.goBack()} />}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>Vos invitations</Title>
          <Title style={styles.count}>
            {allInvitations.filter((i) => i.status === "pending").length} en
            attente
          </Title>
        </View>

        <CompactFilters
          filters={[
            {
              title: "Statut",
              icon: "filter-variant",
              options: [
                { value: "all", label: "Toutes", count: allInvitations.length },
                {
                  value: "pending",
                  label: "En attente",
                  count: allInvitations.filter((i) => i.status === "pending")
                    .length,
                },
                {
                  value: "accepted",
                  label: "Acceptées",
                  count: allInvitations.filter((i) => i.status === "accepted")
                    .length,
                },
                {
                  value: "declined",
                  label: "Refusées",
                  count: allInvitations.filter((i) => i.status === "declined")
                    .length,
                },
              ],
              selectedValue: statusFilter,
              onValueChange: setStatusFilter,
            },
            {
              title: "Type",
              icon: "shape",
              options: [
                { value: "all", label: "Tous", count: allInvitations.length },
                {
                  value: "project",
                  label: "Projets",
                  count: allInvitations.filter((i) => i.type === "project")
                    .length,
                },
                {
                  value: "group",
                  label: "Groupes",
                  count: allInvitations.filter((i) => i.type === "group")
                    .length,
                },
              ],
              selectedValue: typeFilter,
              onValueChange: setTypeFilter,
            },
          ]}
          style={styles.compactFilters}
        />
      </View>

      <View style={styles.listWrapper}>
        {pendingInvitations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune invitation trouvée</Text>
          </View>
        ) : (
          <FlatList
            data={pendingInvitations}
            renderItem={renderInvitation}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => {
          // Force refresh des invitations
          console.log("Refresh invitations");
        }}
        label="Actualiser"
      />
    </SafeAreaView>
  );
};
