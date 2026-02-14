using ContactTracker.ServerDomain;
using ContactTracker.SharedDTOs;

namespace TrackerApi.Mappings;

public static class RoleLevelTypeMappings
{
    public static RoleLevelTypeDto ToDto(this RoleLevelType role)
    {
        return role switch
        {
            RoleLevelType.DefaultRole => RoleLevelTypeDto.DefaultRole,
            RoleLevelType.FrontendDeveloper => RoleLevelTypeDto.FrontendDeveloper,
            RoleLevelType.BackendDeveloper => RoleLevelTypeDto.BackendDeveloper,
            RoleLevelType.FullStackDeveloper => RoleLevelTypeDto.FullStackDeveloper,
            RoleLevelType.DevOpsEngineer => RoleLevelTypeDto.DevOpsEngineer,
            RoleLevelType.QualityAssuranceEngineer => RoleLevelTypeDto.QualityAssuranceEngineer,
            RoleLevelType.DataEngineer => RoleLevelTypeDto.DataEngineer,
            RoleLevelType.SecurityEngineer => RoleLevelTypeDto.SecurityEngineer,

            RoleLevelType.SoftwareArchitect => RoleLevelTypeDto.SoftwareArchitect,
            RoleLevelType.TechLead => RoleLevelTypeDto.TechLead,
            RoleLevelType.StaffEngineer => RoleLevelTypeDto.StaffEngineer,
            RoleLevelType.PrincipalEngineer => RoleLevelTypeDto.PrincipalEngineer,

            RoleLevelType.EngineeringManager => RoleLevelTypeDto.EngineeringManager,
            RoleLevelType.ProductManager => RoleLevelTypeDto.ProductManager,
            RoleLevelType.ProjectManager => RoleLevelTypeDto.ProjectManager,
            RoleLevelType.ScrumMaster => RoleLevelTypeDto.ScrumMaster,

            RoleLevelType.VPOfEngineering => RoleLevelTypeDto.VPOfEngineering,
            RoleLevelType.ChiefTechnologyOfficer => RoleLevelTypeDto.ChiefTechnologyOfficer,

            _ => throw new ArgumentOutOfRangeException(nameof(role), role, null)
        };
    }

    public static RoleLevelType ToDomain(this RoleLevelTypeDto roleDto)
    {
        return roleDto switch
        {
            RoleLevelTypeDto.DefaultRole => RoleLevelType.DefaultRole,
            RoleLevelTypeDto.FrontendDeveloper => RoleLevelType.FrontendDeveloper,
            RoleLevelTypeDto.BackendDeveloper => RoleLevelType.BackendDeveloper,
            RoleLevelTypeDto.FullStackDeveloper => RoleLevelType.FullStackDeveloper,
            RoleLevelTypeDto.DevOpsEngineer => RoleLevelType.DevOpsEngineer,
            RoleLevelTypeDto.QualityAssuranceEngineer => RoleLevelType.QualityAssuranceEngineer,
            RoleLevelTypeDto.DataEngineer => RoleLevelType.DataEngineer,
            RoleLevelTypeDto.SecurityEngineer => RoleLevelType.SecurityEngineer,

            RoleLevelTypeDto.SoftwareArchitect => RoleLevelType.SoftwareArchitect,
            RoleLevelTypeDto.TechLead => RoleLevelType.TechLead,
            RoleLevelTypeDto.StaffEngineer => RoleLevelType.StaffEngineer,
            RoleLevelTypeDto.PrincipalEngineer => RoleLevelType.PrincipalEngineer,

            RoleLevelTypeDto.EngineeringManager => RoleLevelType.EngineeringManager,
            RoleLevelTypeDto.ProductManager => RoleLevelType.ProductManager,
            RoleLevelTypeDto.ProjectManager => RoleLevelType.ProjectManager,
            RoleLevelTypeDto.ScrumMaster => RoleLevelType.ScrumMaster,

            RoleLevelTypeDto.VPOfEngineering => RoleLevelType.VPOfEngineering,
            RoleLevelTypeDto.ChiefTechnologyOfficer => RoleLevelType.ChiefTechnologyOfficer,

            _ => throw new ArgumentOutOfRangeException(nameof(roleDto), roleDto, null)
        };
    }
}
