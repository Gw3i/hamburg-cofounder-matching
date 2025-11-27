import { DotGridBackground } from "@/components/DotGridBackground";
import { LogoIcon } from "@/components/LogoIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APP_TITLE } from "@/const";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { FOUNDER_SKILLS } from "@/lib/founderSkills";
import { trpc } from "@/lib/trpc";
import {
  Briefcase,
  Clock,
  Code,
  ExternalLink,
  Lightbulb,
  Linkedin,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [technicalFilter, setTechnicalFilter] = useState<string>("all");
  const [ideaFilter, setIdeaFilter] = useState<string>("all");
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  const { data: paginatedResult, isLoading } = trpc.profile.list.useQuery(
    {
      currentUserSupabaseId: user?.id,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    { enabled: !!user }
  );

  const profiles = paginatedResult?.data || [];
  const totalProfiles = paginatedResult?.total || 0;
  const totalPages = Math.ceil(totalProfiles / pageSize);

  const { data: currentUserProfile } = trpc.profile.get.useQuery(
    { supabaseId: user?.id || "" },
    { enabled: !!user }
  );

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  // Redirect to profile if not completed or missing essential fields
  useEffect(() => {
    if (!user || authLoading || hasCheckedProfile) return;

    console.log("[Dashboard] Checking profile completion:", {
      profile: currentUserProfile,
      profile_completed: currentUserProfile?.profile_completed,
      current_occupation: currentUserProfile?.current_occupation,
      time_commitment: currentUserProfile?.time_commitment,
    });

    // No profile exists yet - redirect to create one
    if (currentUserProfile === null) {
      console.log("[Dashboard] No profile found, redirecting to /profile");
      setHasCheckedProfile(true);
      setLocation("/profile");
      return;
    }

    // Profile exists but not marked as completed, or missing essential fields
    if (
      currentUserProfile &&
      (!currentUserProfile.profile_completed ||
        !currentUserProfile.current_occupation ||
        !currentUserProfile.time_commitment)
    ) {
      console.log("[Dashboard] Profile incomplete, redirecting to /profile");
      setHasCheckedProfile(true);
      setLocation("/profile");
    } else if (currentUserProfile) {
      // Profile is complete, mark as checked
      console.log("[Dashboard] Profile complete, staying on dashboard");
      setHasCheckedProfile(true);
    }
  }, [currentUserProfile, user, authLoading, hasCheckedProfile, setLocation]);

  const filteredProfiles = useMemo(() => {
    if (!profiles || profiles.length === 0) return [];

    return profiles.filter(profile => {
      const matchesSearch =
        searchQuery === "" ||
        profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.idea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.looking_for?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTechnical =
        technicalFilter === "all" ||
        (technicalFilter === "technical" && profile.is_technical) ||
        (technicalFilter === "non_technical" && !profile.is_technical);

      const matchesIdea =
        ideaFilter === "all" ||
        (ideaFilter === "has_idea" && profile.has_idea) ||
        (ideaFilter === "looking_for_idea" && !profile.has_idea);

      const matchesSkills =
        skillFilters.length === 0 ||
        (profile.skill_areas &&
          skillFilters.some(skill => profile.skill_areas?.includes(skill)));

      return matchesSearch && matchesTechnical && matchesIdea && matchesSkills;
    });
  }, [profiles, searchQuery, technicalFilter, ideaFilter, skillFilters]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, technicalFilter, ideaFilter, skillFilters]);

  const handleLogout = async () => {
    await signOut();
    setLocation("/");
  };

  const getOccupationLabel = (occupation: string | null) => {
    if (!occupation) return "-";
    const labels: Record<string, string> = {
      student: "student",
      working_full_time: "working full-time",
      working_part_time_on_idea: "part-time on idea",
      working_full_time_on_idea: "full-time on idea",
      between_jobs: "between jobs",
    };
    return labels[occupation] || occupation;
  };

  const getCommitmentLabel = (commitment: string | null) => {
    if (!commitment) return "-";
    const labels: Record<string, string> = {
      full_time: "full-time (40+ hrs)",
      part_time: "part-time (20-40 hrs)",
      exploring: "exploring (<20 hrs)",
    };
    return labels[commitment] || commitment;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground lowercase">loading...</div>
      </div>
    );
  }

  return (
    <>
      <DotGridBackground />

      <div className="min-h-screen flex flex-col">
        {/* Header - Mobile first */}
        <header className="px-4 py-4 border-b sm:px-6 sm:py-6 bg-white/80 dark:bg-[#12111d]/80 backdrop-blur sticky top-0 z-10">
          <div className="container flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <LogoIcon className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8" />
              <span className="font-semibold lowercase text-sm truncate sm:text-base">
                {APP_TITLE.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setLocation("/profile")}
                className="lowercase text-xs h-8 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                <span className="hidden sm:inline">my profile</span>
                <span className="sm:hidden">profile</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="lowercase text-xs h-8 px-2 sm:text-sm sm:h-9 sm:px-3"
              >
                sign out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="container max-w-7xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold lowercase mb-2 sm:text-3xl">
                find your co-founder
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {filteredProfiles.length} founder
                {filteredProfiles.length !== 1 ? "s" : ""} in hamburg
              </p>
            </div>

            {/* Filters - Mobile first, stack vertically on mobile */}
            <div className="mb-6">
              {/* All filters in one row on desktop, stacked on mobile */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="search by name, skills, or idea..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 lowercase text-sm sm:text-base bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                  />
                </div>

                {/* Filter Dropdowns and Skills Multi-select - Wrap on mobile */}
                <div className="flex flex-wrap gap-3 lg:flex-shrink-0">
                  <Select
                    value={technicalFilter}
                    onValueChange={setTechnicalFilter}
                  >
                    <SelectTrigger className="lowercase text-sm sm:text-base w-full sm:w-auto lg:w-[180px] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">all founders</SelectItem>
                      <SelectItem value="technical">technical only</SelectItem>
                      <SelectItem value="non_technical">
                        non-technical only
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={ideaFilter} onValueChange={setIdeaFilter}>
                    <SelectTrigger className="lowercase text-sm sm:text-base w-full sm:w-auto lg:w-[180px] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">any idea status</SelectItem>
                      <SelectItem value="has_idea">has an idea</SelectItem>
                      <SelectItem value="looking_for_idea">
                        looking for idea
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Skills Multi-select */}
                  <MultiSelect
                    options={FOUNDER_SKILLS.map(skill => ({
                      value: skill.value,
                      label: skill.label.toLowerCase(),
                    }))}
                    value={skillFilters}
                    onChange={setSkillFilters}
                    placeholder="filter by skills..."
                    className="lowercase text-sm sm:text-base w-full sm:w-auto lg:w-[200px] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="text-muted-foreground lowercase">
                  loading founders...
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProfiles.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground lowercase mb-4">
                    no founders found
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setTechnicalFilter("all");
                      setIdeaFilter("all");
                      setSkillFilters([]);
                    }}
                  >
                    clear filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Mobile: Card View */}
            <div className="block lg:hidden space-y-4">
              {filteredProfiles.map(profile => (
                <Card key={profile.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      {profile.photo_url ? (
                        <img
                          src={profile.photo_url}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {getInitials(profile.name)}
                        </div>
                      )}

                      {/* Name and Badges */}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base lowercase mb-2">
                          {profile.name}, {profile.age}
                        </CardTitle>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.is_technical && (
                            <Badge variant="default" className="text-xs">
                              <Code className="w-3 h-3 mr-1" />
                              technical
                            </Badge>
                          )}
                          {profile.has_idea && (
                            <Badge variant="secondary" className="text-xs">
                              <Lightbulb className="w-3 h-3 mr-1" />
                              has idea
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    {/* Occupation & Commitment */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {getOccupationLabel(profile.current_occupation)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getCommitmentLabel(profile.time_commitment)}
                      </div>
                    </div>

                    {/* Skill Areas */}
                    {profile.skill_areas && profile.skill_areas.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          skills:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {profile.skill_areas.map(skill => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill.replace("_", " & ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Idea */}
                    {profile.idea && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          idea:
                        </p>
                        <p className="text-sm">{profile.idea}</p>
                      </div>
                    )}

                    {/* Looking For */}
                    {profile.looking_for && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          looking for:
                        </p>
                        <p className="text-sm">{profile.looking_for}</p>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {profile.linked_in && (
                      <a
                        href={profile.linked_in}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        linkedin profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop: Table View - Properly wrapped for horizontal scrolling */}
            <div className="hidden lg:block">
              <Card>
                <div className="overflow-x-auto thin-scrollbar">
                  <Table className="min-w-[1100px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="lowercase whitespace-nowrap min-w-[180px]">
                          founder
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[120px]">
                          type
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[140px]">
                          status
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[160px]">
                          commitment
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[200px]">
                          skills
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[200px]">
                          idea
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[200px]">
                          looking for
                        </TableHead>
                        <TableHead className="lowercase whitespace-nowrap min-w-[100px]">
                          contact
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProfiles.map(profile => (
                        <TableRow key={profile.id}>
                          {/* Founder */}
                          <TableCell className="min-w-[180px]">
                            <div className="flex items-center gap-3">
                              {profile.photo_url ? (
                                <img
                                  src={profile.photo_url}
                                  alt={profile.name}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  {getInitials(profile.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-medium lowercase truncate">
                                  {profile.name}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <span>{profile.age} years old</span>
                                  {profile.linked_in && (
                                    <a
                                      href={profile.linked_in}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <Linkedin className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Type */}
                          <TableCell className="min-w-[120px]">
                            <div className="flex flex-col gap-1">
                              {profile.is_technical && (
                                <Badge
                                  variant="default"
                                  className="text-xs w-fit"
                                >
                                  <Code className="w-3 h-3 mr-1" />
                                  technical
                                </Badge>
                              )}
                              {profile.has_idea && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs w-fit"
                                >
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  has idea
                                </Badge>
                              )}
                              {!profile.is_technical && !profile.has_idea && (
                                <span className="text-xs text-muted-foreground">
                                  -
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="text-sm min-w-[140px] whitespace-nowrap">
                            {getOccupationLabel(profile.current_occupation)}
                          </TableCell>

                          {/* Commitment */}
                          <TableCell className="text-sm min-w-[160px] whitespace-nowrap">
                            {getCommitmentLabel(profile.time_commitment)}
                          </TableCell>

                          {/* Skills */}
                          <TableCell className="min-w-[200px]">
                            {profile.skill_areas &&
                            profile.skill_areas.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {profile.skill_areas.map(skill => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs lowercase whitespace-nowrap"
                                  >
                                    {skill.replace("_", " & ")}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>

                          {/* Idea */}
                          <TableCell className="min-w-[200px] max-w-[300px]">
                            <div className="w-full max-w-[280px]">
                              <p className="text-sm break-words whitespace-normal">
                                {profile.idea || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Looking For */}
                          <TableCell className="min-w-[200px] max-w-[300px]">
                            <div className="w-full max-w-[280px]">
                              <p className="text-sm break-words whitespace-normal">
                                {profile.looking_for || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Contact */}
                          <TableCell className="min-w-[100px]">
                            {profile.linked_in ? (
                              <a
                                href={profile.linked_in}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline whitespace-nowrap"
                              >
                                linkedin
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, totalProfiles)} of{" "}
                      {totalProfiles} profiles
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || isLoading}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                disabled={isLoading}
                                className="w-9"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(p => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages || isLoading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
