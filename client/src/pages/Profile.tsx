import { DotGridBackground } from "@/components/DotGridBackground";
import { LogoIcon } from "@/components/LogoIcon";
import { SkillPicker } from "@/components/SkillPicker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APP_TITLE } from "@/const";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { trpc } from "@/lib/trpc";
import {
  Briefcase,
  Code,
  Download,
  Lightbulb,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, session, loading: authLoading, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [currentOccupation, setCurrentOccupation] = useState<
    | "student"
    | "working_full_time"
    | "working_part_time_on_idea"
    | "working_full_time_on_idea"
    | "between_jobs"
  >("working_full_time");
  const [timeCommitment, setTimeCommitment] = useState<
    "full_time" | "part_time" | "exploring"
  >("full_time");
  const [isTechnical, setIsTechnical] = useState(false);
  const [hasIdea, setHasIdea] = useState(false);
  const [skillAreas, setSkillAreas] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [skills, setSkills] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: profile, isLoading: profileLoading } =
    trpc.profile.get.useQuery(
      { supabaseId: user?.id || "" },
      { enabled: !!user }
    );

  const utils = trpc.useUtils();

  const upsertProfile = trpc.profile.upsert.useMutation({
    onSuccess: async () => {
      toast.success("profile saved successfully");
      // Invalidate profile query to ensure Dashboard sees updated data
      await utils.profile.get.invalidate();
      setLocation("/dashboard");
    },
    onError: error => {
      toast.error(error.message || "failed to save profile");
    },
  });

  const uploadPhoto = trpc.profile.uploadPhoto.useMutation();

  const deleteAccount = trpc.profile.delete.useMutation({
    onSuccess: async () => {
      toast.success("account deleted successfully");
      await signOut();
      setLocation("/");
    },
    onError: error => {
      toast.error(error.message || "failed to delete account");
      setDeleting(false);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age?.toString() || "");
      setCurrentOccupation(profile.current_occupation || "working_full_time");
      setTimeCommitment(profile.time_commitment || "full_time");
      setIsTechnical(profile.is_technical || false);
      setHasIdea(profile.has_idea || false);
      setSkillAreas(profile.skill_areas || []);
      setIdea(profile.idea || "");
      setLookingFor(profile.looking_for || "");
      setSkills(profile.skills || "");
      setLinkedIn(profile.linked_in || "");
      setPhotoUrl(profile.photo_url || "");
      if (profile.photo_url) {
        setPhotoPreview(profile.photo_url);
      }
    }
  }, [profile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("image must be less than 5MB");
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !session?.access_token) {
      toast.error("please sign in to save your profile");
      return;
    }

    // Validate required fields
    if (!name.trim()) {
      toast.error("please enter your name");
      return;
    }

    if (!age || parseInt(age) < 18) {
      toast.error("please enter a valid age (18+)");
      return;
    }

    if (!currentOccupation) {
      toast.error("please select your current situation");
      return;
    }

    if (!timeCommitment) {
      toast.error("please select your time commitment");
      return;
    }

    if (!lookingFor.trim()) {
      toast.error("please describe what you're looking for in a co-founder");
      return;
    }

    if (!skills.trim()) {
      toast.error("please describe your skills and experience");
      return;
    }

    setLoading(true);

    try {
      let finalPhotoUrl = photoUrl;

      // Upload photo if there's a new one
      if (photoFile) {
        setUploadingPhoto(true);
        const reader = new FileReader();

        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64 = reader.result as string;
              const result = await uploadPhoto.mutateAsync({
                userId: user.id,
                photoData: base64,
                mimeType: photoFile.type,
              });
              finalPhotoUrl = result.url;
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(photoFile);
        });

        setUploadingPhoto(false);
      }

      // Save profile
      await upsertProfile.mutateAsync({
        supabaseId: user.id,
        email: user.email || "",
        name,
        age: parseInt(age) || null,
        current_occupation: currentOccupation,
        time_commitment: timeCommitment,
        is_technical: isTechnical,
        has_idea: hasIdea,
        skill_areas: skillAreas,
        idea,
        looking_for: lookingFor,
        skills,
        linked_in: linkedIn,
        photo_url: finalPhotoUrl,
        profile_completed: true, // Mark profile as completed when saving
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("failed to save profile");
    } finally {
      setLoading(false);
      setUploadingPhoto(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DotGridBackground />
        <div className="text-center">
          <div className="text-lg">loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DotGridBackground />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <LogoIcon className="h-6 w-6" />
            <span className="font-semibold text-sm sm:text-base">
              {APP_TITLE}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
            >
              dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-2xl relative z-10">
        {/* Page Header with Progress */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            your founder profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {!profile?.profile_completed ? (
              <span className="text-primary font-medium">
                👋 welcome! complete your profile to start browsing founders in
                hamburg
              </span>
            ) : (
              "tell us about yourself so we can help you find the perfect co-founder"
            )}
          </p>

          {/* Profile Completion Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">profile completion</span>
              <span className="font-medium">
                {(() => {
                  const totalFields = 9; // name, age, occupation, commitment, skills, skill_areas, looking_for, photo, linkedin
                  let filledFields = 0;
                  if (name) filledFields++;
                  if (age) filledFields++;
                  if (currentOccupation) filledFields++;
                  if (timeCommitment) filledFields++;
                  if (skills) filledFields++;
                  if (skillAreas.length > 0) filledFields++;
                  if (lookingFor) filledFields++;
                  if (photoUrl || photoPreview) filledFields++;
                  if (linkedIn) filledFields++;
                  const percentage = Math.round(
                    (filledFields / totalFields) * 100
                  );
                  return `${percentage}% (${filledFields}/${totalFields} fields)`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{
                  width: `${(() => {
                    const totalFields = 9;
                    let filledFields = 0;
                    if (name) filledFields++;
                    if (age) filledFields++;
                    if (currentOccupation) filledFields++;
                    if (timeCommitment) filledFields++;
                    if (skills) filledFields++;
                    if (skillAreas.length > 0) filledFields++;
                    if (lookingFor) filledFields++;
                    if (photoUrl || photoPreview) filledFields++;
                    if (linkedIn) filledFields++;
                    return Math.round((filledFields / totalFields) * 100);
                  })()}%`,
                }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Profile Basics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-bold">profile basics</span>
              </CardTitle>
              <CardDescription>your essential information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>profile photo</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full p-0.5 hover:bg-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      max 5MB, jpg/png
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="25"
                    required
                    min="18"
                    max="100"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedIn">linkedin profile</Label>
                <Input
                  id="linkedIn"
                  type="url"
                  value={linkedIn}
                  onChange={e => setLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: About Me */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span className="font-bold">about me</span>
              </CardTitle>
              <CardDescription>
                tell potential cofounders who you are and what you bring to the
                table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Occupation */}
              <div className="space-y-2">
                <Label htmlFor="current_occupation">current situation *</Label>
                <Select
                  value={currentOccupation}
                  onValueChange={(value: any) => setCurrentOccupation(value)}
                >
                  <SelectTrigger id="current_occupation">
                    <SelectValue placeholder="select your current situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">student</SelectItem>
                    <SelectItem value="working_full_time">
                      working full-time (at a company)
                    </SelectItem>
                    <SelectItem value="working_part_time_on_idea">
                      working part-time on my idea
                    </SelectItem>
                    <SelectItem value="working_full_time_on_idea">
                      working full-time on my idea
                    </SelectItem>
                    <SelectItem value="between_jobs">between jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Commitment */}
              <div className="space-y-2">
                <Label htmlFor="time_commitment">
                  time commitment i can offer *
                </Label>
                <Select
                  value={timeCommitment}
                  onValueChange={(value: any) => setTimeCommitment(value)}
                >
                  <SelectTrigger id="time_commitment">
                    <SelectValue placeholder="select your time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">
                      full-time (40+ hours/week)
                    </SelectItem>
                    <SelectItem value="part_time">
                      part-time (20-40 hours/week)
                    </SelectItem>
                    <SelectItem value="exploring">
                      exploring (&lt;20 hours/week)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Key Attributes */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  key attributes
                </h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_technical"
                    checked={isTechnical}
                    onCheckedChange={checked =>
                      setIsTechnical(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="is_technical"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    i'm technical (can build the product without outside help)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_idea"
                    checked={hasIdea}
                    onCheckedChange={checked => setHasIdea(checked as boolean)}
                  />
                  <label
                    htmlFor="has_idea"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                  >
                    <Lightbulb className="w-4 h-4" />i have a specific idea i
                    want to work on
                  </label>
                </div>
              </div>

              {/* Skill Areas */}
              <div className="space-y-2">
                <Label>skill areas (select all that apply) *</Label>
                <SkillPicker
                  selectedSkills={skillAreas}
                  onChange={setSkillAreas}
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills">
                  my skills & experience *
                  <span className="text-muted-foreground font-normal text-xs ml-2">
                    (what you bring to the table)
                  </span>
                </Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="describe your own skills and experience, e.g., React, Python, Machine Learning, B2B Sales, 5 years in fintech..."
                  rows={3}
                  required
                />
              </div>

              {/* Idea */}
              <div className="space-y-2">
                <Label htmlFor="idea">my startup idea {hasIdea && "*"}</Label>
                <Textarea
                  id="idea"
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  placeholder={
                    hasIdea
                      ? "describe your startup idea..."
                      : "what kind of problems interest you?"
                  }
                  rows={3}
                  required={hasIdea}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: What I'm Looking For */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                <span className="font-bold">what i'm looking for</span>
              </CardTitle>
              <CardDescription>
                describe your ideal cofounder and what you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Looking For */}
              <div className="space-y-2">
                <Label htmlFor="lookingFor">
                  what i'm looking for in a cofounder *
                </Label>
                <Textarea
                  id="lookingFor"
                  value={lookingFor}
                  onChange={e => setLookingFor(e.target.value)}
                  placeholder="e.g., technical co-founder with experience in AI/ML, someone who can commit full-time, has experience with B2B SaaS..."
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  be specific about the skills, experience, and commitment level
                  you're seeking
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading || uploadingPhoto}
          >
            {loading || uploadingPhoto ? "saving..." : "save profile"}
          </Button>
        </form>

        {/* Account Management Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>account management</CardTitle>
            <CardDescription>
              export your data or manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Export Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 lowercase">
                data portability
              </h3>
              <p className="text-sm text-muted-foreground mb-4 lowercase">
                download all your profile data in json format (gdpr article 20).
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (!profile) return;

                  // Create export data with timestamp
                  const exportData = {
                    exported_at: new Date().toISOString(),
                    profile: {
                      user_id: profile.user_id,
                      name: profile.name,
                      age: profile.age,
                      current_occupation: profile.current_occupation,
                      time_commitment: profile.time_commitment,
                      is_technical: profile.is_technical,
                      has_idea: profile.has_idea,
                      skill_areas: profile.skill_areas,
                      idea: profile.idea,
                      looking_for: profile.looking_for,
                      skills: profile.skills,
                      linked_in: profile.linked_in,
                      photo_url: profile.photo_url,
                      created_at: profile.created_at,
                      updated_at: profile.updated_at,
                      last_active_at: profile.last_active_at,
                    },
                  };

                  // Create blob and download
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  const timestamp = new Date().toISOString().split("T")[0];
                  a.download = `hamburg-cofounder-profile-${timestamp}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);

                  toast.success("profile data exported successfully");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                download my data
              </Button>
            </div>

            {/* Delete Account Section */}
            <div className="pt-6 border-t">
              <h3 className="text-sm font-semibold text-destructive mb-2 lowercase">
                danger zone
              </h3>
              <p className="text-sm text-muted-foreground mb-4 lowercase">
                permanently delete your account and all associated data. this
                action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? "deleting..." : "delete account"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="lowercase">
                      are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="lowercase">
                      this action cannot be undone. this will permanently delete
                      your account, remove your profile from our platform, and
                      delete all your data including:
                      <ul className="list-disc pl-6 mt-2">
                        <li>profile information</li>
                        <li>profile photo</li>
                        <li>all personal data</li>
                      </ul>
                      <p className="mt-2 font-semibold">
                        this complies with gdpr's right to erasure.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="lowercase">
                      cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 lowercase"
                      onClick={async () => {
                        if (!user || !session?.access_token) return;
                        setDeleting(true);
                        deleteAccount.mutate({
                          supabaseId: user.id,
                        });
                      }}
                    >
                      yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
