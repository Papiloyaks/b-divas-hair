import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiTrash2, FiLock, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const ProfileSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // --- Personal info ---
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [savingInfo, setSavingInfo] = useState(false);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const { data } = await api.put("/auth/profile", infoForm);
      updateUser(data);
      toast.success("Profile updated");
      setEditingInfo(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingInfo(false);
    }
  };

  // --- Change password ---
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  // --- Notification settings ---
  const [preferences, setPreferences] = useState(
    user?.preferences || { emailOrderUpdates: true, emailPromotions: true }
  );
  const [savingPreferences, setSavingPreferences] = useState(false);

  const togglePreference = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    setSavingPreferences(true);
    try {
      const { data } = await api.put("/auth/profile", { preferences: updated });
      updateUser(data);
    } catch {
      toast.error("Could not save preference — try again");
      setPreferences(preferences); // revert on failure
    } finally {
      setSavingPreferences(false);
    }
  };

  // --- Account management ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await api.delete("/auth/account", { data: { password: deletePassword } });
      toast.success("Account deleted");
      logout();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      {/* Personal Information */}
      <section>
        <h2 className="font-display text-xl mb-4">Personal Information</h2>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-[#0F0F0F] text-[#D4AF37] flex items-center justify-center text-xl shrink-0">
            <FiUser size={24} />
          </div>
          <div>
            <p className="font-medium">{user?.name || "Guest User"}</p>
            <p className="text-sm text-[#6B4F4F]">{user?.email}</p>
            {user?.phone && <p className="text-sm text-[#6B4F4F]">{user.phone}</p>}
          </div>
        </div>

        {editingInfo ? (
          <form onSubmit={handleSaveInfo} className="space-y-3">
            <input
              value={infoForm.name}
              onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
              placeholder="Full name"
              className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              value={infoForm.phone}
              onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingInfo}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0F0F0F] text-white text-sm hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
              >
                <FiSave size={14} /> {savingInfo ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditingInfo(false)}
                className="px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setEditingInfo(true)}
            className="px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
          >
            Edit Details
          </button>
        )}
      </section>

      {/* Change Password */}
      <section className="border-t border-[#F7E7CE] pt-8">
        <h2 className="font-display text-xl mb-4">Change Password</h2>
        {showPasswordForm ? (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full border border-[#F7E7CE] px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0F0F0F] text-white text-sm hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors disabled:opacity-60"
              >
                <FiLock size={14} /> {savingPassword ? "Saving..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
          >
            Change Password
          </button>
        )}
      </section>

      {/* Settings */}
      <section className="border-t border-[#F7E7CE] pt-8">
        <h2 className="font-display text-xl mb-4">Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">Order update emails</p>
              <p className="text-xs text-[#6B4F4F]">Shipping and delivery status notifications</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailOrderUpdates}
              onChange={() => togglePreference("emailOrderUpdates")}
              disabled={savingPreferences}
              className="w-5 h-5 accent-[#D4AF37]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium">Promotional emails</p>
              <p className="text-xs text-[#6B4F4F]">New arrivals, sales, and offers</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.emailPromotions}
              onChange={() => togglePreference("emailPromotions")}
              disabled={savingPreferences}
              className="w-5 h-5 accent-[#D4AF37]"
            />
          </label>
        </div>
      </section>

      {/* Account Management */}
      <section className="border-t border-[#F7E7CE] pt-8">
        <h2 className="font-display text-xl mb-4">Account Management</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
          >
            <FiLogOut size={14} /> Logout
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-colors"
          >
            <FiTrash2 size={14} /> Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <form
            onSubmit={handleDeleteAccount}
            className="mt-4 p-4 border border-red-200 bg-red-50 space-y-3"
          >
            <p className="text-sm text-red-700">
              This permanently deletes your account and cannot be undone. Enter your password to confirm.
            </p>
            <input
              type="password"
              placeholder="Your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border border-red-300 px-4 py-3 focus:outline-none focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={deleting}
                className="px-5 py-2.5 bg-red-500 text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Permanently Delete My Account"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 border border-[#0F0F0F] text-sm hover:bg-[#0F0F0F] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Privacy Policy */}
      <section className="border-t border-[#F7E7CE] pt-8">
        <h2 className="font-display text-xl mb-4">Privacy</h2>
        <Link to="/privacy" className="text-sm text-[#D4AF37] underline">
          View our Privacy Policy
        </Link>
      </section>
    </div>
  );
};

export default ProfileSettings;