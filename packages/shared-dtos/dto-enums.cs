using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.SharedDTOs;

[ExportTsEnum]
public enum RoleLevel
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
    Inbound, Outbound
}