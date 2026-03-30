import { StyleSheet } from "react-native";
import { Colors } from "../../../constant";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  header: {
    backgroundColor: Colors.PRIMARY[100],
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  headerTitle: { color: "#fff", fontWeight: "900", fontSize: 18 },

  profileCard: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E9ECF2",
  },
  avatar: { width: "100%", height: "100%" },
  name: { fontSize: 18, fontWeight: "900", color: "#111214", marginBottom: 2 },
  subTitle: { color: "#6B7280", fontWeight: "800" },
  badgesRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  badge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  badgePrimary: { backgroundColor: "rgba(108,99,255,0.14)" },
  badgeNeutral: { backgroundColor: "rgba(107,114,128,0.12)" },
  badgeTextPrimary: { color: "#6C63FF", fontWeight: "900", fontSize: 12 },
  badgeTextNeutral: { color: "#6B7280", fontWeight: "900", fontSize: 12 },

  infoCard: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },
  infoLabel: { color: "#9CA3AF", fontWeight: "900" },
  infoValue: {
    color: "#111214",
    fontWeight: "900",
    flex: 1,
    textAlign: "right",
  },
  divider: { height: 1, backgroundColor: "#EEF0F5" },

  mapCard: {
    marginTop: 12,
    marginHorizontal: 12,
    height: 210,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E9ECF2",
  },
  mapOverlayPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(17,18,20,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  mapOverlayText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  actions: {
    marginTop: 14,
    marginHorizontal: 12,
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#E9ECF2",
  },
  btnText: { color: Colors.white, fontWeight: "800" },
  btnTextSecondary: { color: "#111214" },
});

export default styles;