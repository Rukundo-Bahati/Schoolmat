import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Save } from "lucide-react"
import PasswordChangeForm from "./password-change-form"

interface ProfileData {
  parentName: string
  email: string
  phone: string
  studentName: string
  studentGrade: string
  studentClass: string
  address: string
}

interface ProfileTabProps {
  profileData: ProfileData
  isEditingProfile: boolean
  showChangePassword: boolean
  onProfileDataChange: (data: ProfileData) => void
  onEditToggle: () => void
  onPasswordToggle: () => void
}

export default function ProfileTab({
  profileData,
  isEditingProfile,
  showChangePassword,
  onProfileDataChange,
  onEditToggle,
  onPasswordToggle,
}: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <Button
          onClick={onEditToggle}
          className="rounded-full bg-blue-700 hover:bg-blue-800"
        >
          {isEditingProfile ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditingProfile ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                <Input
                  type="text"
                  value={profileData.parentName}
                  onChange={(e) => onProfileDataChange({ ...profileData, parentName: e.target.value })}
                  disabled={!isEditingProfile}
                  className="rounded-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => onProfileDataChange({ ...profileData, email: e.target.value })}
                  disabled={!isEditingProfile}
                  className="rounded-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => onProfileDataChange({ ...profileData, phone: e.target.value })}
                  disabled={!isEditingProfile}
                  className="rounded-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => onProfileDataChange({ ...profileData, address: e.target.value })}
                  disabled={!isEditingProfile}
                  className="rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
              <p className="text-xs text-gray-500">Read-only</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Student information is managed by the school administration and cannot be edited by parents.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                <Input
                  type="text"
                  value={profileData.studentName}
                  disabled={true}
                  className="rounded-full bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  value={profileData.studentGrade}
                  disabled={true}
                  className="w-full rounded-full border border-gray-300 px-4 py-2 bg-gray-50 appearance-none cursor-default"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <Input
                  type="text"
                  value={profileData.studentClass}
                  disabled={true}
                  className="rounded-full bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Change Section */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            <Button
              variant="outline"
              onClick={onPasswordToggle}
              className="rounded-full"
            >
              Change Password
            </Button>
          </div>

          {showChangePassword && (
            <PasswordChangeForm onCancel={onPasswordToggle} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
