// TODO: update packages/validation/src/lib/enum-schema.ts if this changes
using TypeGen.Core.TypeAnnotations;

namespace ContactTracker.Libs.Shared.DTOs;

[ExportTsEnum]
public enum RoleLevel
{
    EngineeringManager,
    StaffEngineer
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