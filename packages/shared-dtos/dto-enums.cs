using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsEnum]
public enum RoleLevelType
{
    FrontendDeveloper,
    BackendDeveloper,
    FullStackDeveloper,
    DevOpsEngineer,
    QualityAssuranceEngineer,
    DataEngineer,
    SecurityEngineer,

    // Technical Leadership & Architecture
    SoftwareArchitect,
    TechLead,
    StaffEngineer,
    PrincipalEngineer,

    // Management & Product
    EngineeringManager,
    ProductManager,
    ProjectManager,
    ScrumMaster,

    // Executive Leadership
    VPOfEngineering,
    ChiefTechnologyOfficer
}


[ExportTsEnum]
public enum SourceType
{
    Email, LinkedIn, Website, Recruiter, Referral
}

[ExportTsEnum]
public enum DirectionType
{
    Inbound, // email or message from recruiter, etc.
    Outbound // applied to role, followed up with recruiter, etc.
}

[ExportTsEnum]
public enum EventTypeCategoryType
{
    Discovery,      // Lead, Research
    Networking,     // Coffee Chat, Referral Request
    Application,    // Applied, Withdrew
    Communication,  // Recruiter Call, Follow-up
    Assessment,     // Take-home, Tech Test
    Interview,      // Technical, Behavioral, Onsite
    Offer,          // Offer Received, Negotiation
    Outcome         // Hired, Rejected, Ghosted
}