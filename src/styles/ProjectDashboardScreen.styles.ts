import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../utils/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  accessDeniedText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  overviewCard: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  card: {
    marginBottom: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  priorityItem: {
    marginRight: 8,
    marginBottom: 8,
  },
  priorityChip: {
    borderRadius: 16,
  },
  priorityChipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  memberPerformance: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  memberTickets: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  memberStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberStatItem: {
    alignItems: "center",
    marginLeft: 16,
  },
  memberStatNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  memberStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  groupPerformance: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  groupStats: {
    alignItems: "flex-end",
  },
  groupTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  groupCompleted: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  projectInfo: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});
