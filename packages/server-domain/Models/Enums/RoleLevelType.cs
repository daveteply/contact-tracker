namespace ContactTracker.ServerDomain;

// [ExportTsEnum]

public enum RoleLevelType
{
    DefaultRole,
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