import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Calendar,
  Building,
  GraduationCap,
  User,
  Star,
  Globe,
  Heart,
  Briefcase,
  Award,
  Target,
  Clock,
} from "lucide-react";
import { getPublicProfile } from "../data/profile";
import { ComprehensiveProfile } from "../types/Profile";

export default function PublicSharedProfile() {
  const params = useParams();
  const shareId = params.shareId;

  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered - shareId:", shareId);

    if (shareId) {
      loadProfile(shareId);
    } else {
      console.log("No shareId found");
      setError(true);
      setLoading(false);
    }
  }, [shareId]);

  const loadProfile = async (id: string) => {
    try {
      setLoading(true);
      setError(false);

      const data = await getPublicProfile(id);

      if (data) {
        setProfile(data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading shared profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    const firstName = profile?.personal_info?.firstName || "";
    const lastName = profile?.personal_info?.lastName || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`;
  };

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Indlæser profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    console.log("Rendering error state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profil ikke fundet
          </h1>
          <p className="text-gray-600 mb-6">
            Dette link er enten udløbet eller eksisterer ikke længere.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gå til forsiden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen w-full overflow-y-auto bg-gradient-to-br from-background  to-card">
      <div className="w-full min-h-screen">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-chart-1 to-chart-5 rounded-full flex items-center justify-center text-foreground text-2xl font-bold shadow-lg">
                {getInitials()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-chart-2 rounded-full border-4 border-foreground flex items-center justify-center">
                <Star className="w-4 h-4 text-foreground" />
              </div>
            </div>

            <h1 className="text-5xl font-bold text-primary mb-3">
              {profile.personal_info?.firstName}{" "}
              {profile.personal_info?.lastName}
            </h1>

            <p className="text-2xl text-chart-1 font-semibold mb-4">
              {profile.professional_info?.currentTitle || "Professional"}
            </p>

            {profile.personal_info?.bio && (
              <p className="text-lg text-ring max-w-3xl mx-auto leading-relaxed">
                {profile.personal_info.bio}
              </p>
            )}

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-8">
              {profile.professional_info?.yearsExperience && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {profile.professional_info.yearsExperience}
                  </div>
                  <div className="text-sm text-gray-600">År erfaring</div>
                </div>
              )}
              {profile.technical_skills && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {profile.technical_skills.length}
                  </div>
                  <div className="text-sm text-ring">Færdigheder</div>
                </div>
              )}
              {profile.work_experience && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {profile.work_experience.length}
                  </div>
                  <div className="text-sm text-ring">Stillinger</div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Work Experience */}
              {profile.work_experience &&
                profile.work_experience.length > 0 && (
                  <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-chart-1 to-chart-4 text-primary pt-2 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Briefcase className="h-6 w-6" />
                        Arbejdserfaring
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-8">
                        {profile.work_experience.map((exp, index) => (
                          <div key={index} className="relative">
                            {index !== profile.work_experience!.length - 1 && (
                              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-chart-4 to-transparent"></div>
                            )}
                            <div className="flex gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-chart-2 to-chart-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-primary mb-1">
                                  {exp.position}
                                </h3>
                                <div className="flex items-center gap-2 text-chart-1 font-semibold mb-2">
                                  <Building className="h-4 w-4" />
                                  <span>{exp.company}</span>
                                </div>
                                <div className="flex items-center gap-2 text-ring mb-3">
                                  <Calendar className="h-4 w-4" />
                                  <span>{exp.period}</span>
                                </div>
                                {exp.description && (
                                  <p className="text-ring leading-relaxed bg-foreground p-4 rounded-lg">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-chart-2 to-sidebar-border text-foreground rounded-t-lg pt-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <GraduationCap className="h-6 w-6" />
                      Uddannelse
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {profile.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-chart-2 pl-4"
                        >
                          <h3 className="text-lg font-semibold text-accent">
                            {edu.degree}
                          </h3>
                          <p className="text-chart-2 font-medium">
                            {edu.institution}
                          </p>
                          <div className="flex items-center gap-4 text-ring text-sm mt-1">
                            <span>{edu.period}</span>
                            {edu.grade && <span>Karakter: {edu.grade}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Technical Skills */}
                {profile.technical_skills &&
                  profile.technical_skills.length > 0 && (
                    <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-chart-4 to-chart-5 text-primary rounded-t-lg pt-2">
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Tekniske Færdigheder
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {profile.technical_skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gradient-to-r from-chart-4 to-chart-5 text-foreground border-chart-4 "
                            >
                              {skill.skill_name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Soft Skills */}
                {profile.soft_skills && profile.soft_skills.length > 0 && (
                  <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-destructive to-chart-5 text-primary rounded-t-lg pt-2">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Personlige Færdigheder
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.soft_skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gradient-to-r from-primary to-sidebar-foreground text-chart-5 border-foreground"
                          >
                            {skill.skill_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Languages & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Languages */}
                {profile.languages && profile.languages.length > 0 && (
                  <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-chart-1 to-sidebar-primary text-primary rounded-t-lg pt-2">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Sprog
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang, index) => (
                          <Badge
                            key={index}
                            variant="default"
                            className="bg-gradient-to-r from-chart-2 to-chart-1 text-primary border-chart-2"
                          >
                            {lang.language_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <Card className="shadow-lg border-0 bg-card backdrop-blur-sm ">
                    <CardHeader className="bg-gradient-to-r from-chart-2 to-sidebar-primary text-primary rounded-t-lg pt-2">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Interesser
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gradient-to-r from-sidebar-foreground to-sidebar-accent-foreground text-chart-2 border-sidebar-foreground "
                          >
                            {interest.interest_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-muted to-popover text-primary rounded-t-lg pt-2">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kontaktoplysninger
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {profile.personal_info?.email && (
                    <div className="flex items-center gap-3 p-3 bg-sidebar-primary-foreground rounded-lg">
                      <Mail className="h-5 w-5 text-chart-1" />
                      <a
                        href={`mailto:${profile.personal_info.email}`}
                        className="text-chart-1 font-medium hover:underline transition-colors"
                      >
                        {profile.personal_info.email}
                      </a>
                    </div>
                  )}
                  {profile.personal_info?.phone && (
                    <div className="flex items-center gap-3 p-3 bg-secondary-foreground rounded-lg">
                      <Phone className="h-5 w-5 text-chart-2" />
                      <span className="text-muted font-medium">
                        {profile.personal_info.phone}
                      </span>
                    </div>
                  )}
                  {profile.personal_info?.location && (
                    <div className="flex items-center gap-3 p-3 bg-secondary-foreground rounded-lg">
                      <MapPin className="h-5 w-5 text-chart-4" />
                      <span className="text-muted font-medium">
                        {profile.personal_info.location}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Professional Info */}
              {profile.professional_info && (
                <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-chart-1 to-chart-4 text-primary rounded-t-lg pt-2">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professionelt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {profile.professional_info.yearsExperience && (
                      <div className="flex items-center gap-3 p-3 bg-secondary-foreground rounded-lg">
                        <Clock className="h-5 w-5 text-chart-1" />
                        <span className="text-muted">
                          <strong>
                            {profile.professional_info.yearsExperience}
                          </strong>{" "}
                          års erfaring
                        </span>
                      </div>
                    )}
                    {profile.professional_info.salaryExpectation && (
                      <div className="flex items-center gap-3 p-3 bg-secondary-foreground rounded-lg">
                        <Target className="h-5 w-5 text-chart-2" />
                        <span className="text-muted">
                          Lønforventning:{" "}
                          <strong>
                            {profile.professional_info.salaryExpectation}
                          </strong>
                        </span>
                      </div>
                    )}
                    {profile.professional_info.availableFrom && (
                      <div className="flex items-center gap-3 p-3 bg-secondary-foreground rounded-lg">
                        <Calendar className="h-5 w-5 text-chart-5" />
                        <span className="text-muted">
                          Tilgængelig fra:{" "}
                          <strong>
                            {profile.professional_info.availableFrom}
                          </strong>
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Job Preferences */}
              {(profile.preferred_roles?.length ||
                profile.preferred_company_sizes?.length ||
                profile.work_arrangements?.length ||
                profile.industries?.length) && (
                <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary rounded-t-lg pt-2">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Jobpræferencer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {profile.preferred_roles &&
                      profile.preferred_roles.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">
                            Ønskede roller
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.preferred_roles.map((role, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {role.role_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {profile.work_arrangements &&
                      profile.work_arrangements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">
                            Arbejdsarrangement
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.work_arrangements.map(
                              (arrangement, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {arrangement.arrangement_type}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {profile.preferred_company_sizes &&
                      profile.preferred_company_sizes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary mb-2">
                            Virksomhedsstørrelse
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.preferred_company_sizes.map(
                              (size, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {size.company_size}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {profile.industries && profile.industries.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary mb-2">
                          Brancher
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.industries.map((industry, index) => (
                            <Badge
                              key={index}
                              variant="default"
                              className="text-xs"
                            >
                              {industry.industry_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Links & Documents */}
              {(profile.professional_info?.links?.portfolio ||
                profile.professional_info?.links?.linkedin ||
                profile.professional_info?.links?.github ||
                profile.professional_info?.links?.cv) && (
                <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-destructive to-chart-5 text-primary rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Links & Dokumenter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {profile.professional_info?.links?.portfolio && (
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                        >
                          <a
                            href={profile.professional_info.links.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                      {profile.professional_info?.links?.linkedin && (
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                        >
                          <a
                            href={profile.professional_info.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {profile.professional_info?.links?.github && (
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                        >
                          <a
                            href={profile.professional_info.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {profile.professional_info?.links?.cv && (
                        <Button
                          variant="outline"
                          asChild
                          className="w-full justify-start"
                        >
                          <a
                            href={profile.professional_info.links.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            CV Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 p-6 bg-card backdrop-blur-sm rounded-lg border border-secondary-foreground">
            <p className="text-muted">
              Denne profil blev delt den{" "}
              <strong>
                {new Date(profile.created_at).toLocaleDateString("da-DK")}
              </strong>
            </p>
            <p className="text-sm text-muted mt-2">
              Oprettet med ❤️ på Strackly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
