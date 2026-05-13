// Display names for weapon requirement ids from the exported action data.
export const EQUIPMENT_TYPE_NAMES: Record<number, string> = {
    0: '1H Sword',
    1: '2H Axe',
    2: '2H Sword',
    3: 'Polearm',
    4: 'Bow',
    5: '1H Gun',
    6: '2H Gun',
    7: '1H Axe',
    8: 'Staff',
    9: 'Wand',
    10: '1H Mace',
    11: '2H Mace',
    12: 'Unarmed',
    13: 'Shield',
    14: 'Fist Weapon',
    15: 'None',
};

// Normalized damage data used by tooltip damage calculations.
export type DamageEffect = {
    rawExpression: string;
    statType: string;
    coefficient: number;
    effectType: string;
    damageMultiplier: number | null;
};

// Normalized status data from exported skill actions.
export type StatusEffect = {
    name: string;
    infinite: boolean;
    duration: string;
    expireType: number;
};

// Wraps the raw action export with defaults for fields used by the UI.
export class Action {
    name: string;
    overrideDescriptionAndName: boolean;
    description: string;
    descriptionExpressions: unknown[];
    damageExpressionOverrides: unknown[];
    ignoreSourceStatus: boolean;
    skipTextAndAnimation: boolean;
    overrideActionName: boolean;
    actionNameOverride: string;
    overrideSkillType: boolean;
    overrideDamageStatType: boolean;
    useActionChances: boolean;
    targetTextOverride: string;
    useMaxRangeOverride: boolean;
    maxRangeOverride: number;
    useMaxRangeBlastOverride: boolean;
    maxRangeBlastOverride: number;
    useKnockback: boolean;
    knockbackAmount: number;
    useMultipleHits: boolean;
    numHits: number;
    multipleHitRange: string;
    useNumHitsEquation: boolean;
    numHitsEquation: string;
    hitInterval: number;
    multipleHitTarget: string;
    multipleHitTargetOrderBy: string;
    multipleHitTargetRandomize: boolean;
    useCondition: string;
    useConditionFailText: string;
    cooldown: string;
    hasCharges: boolean;
    maxCharges: string;
    initialCharges: string;
    chargesPerBattle: string;
    startingBattleCharges: string;
    restoreAllChargesOnTownReturn: boolean;
    cost: string;
    manaCostRatio: number;
    addWeaponCost: boolean;
    numCasts: string;
    useGlobalDamageRange: boolean;
    skillTags: number[];
    hasWeaponRequirement: boolean;
    hasWeaponRequirementTypes: boolean;
    hasWeaponRequirementTags: boolean;
    costsMana: boolean;
    manaCost: number;
    requiredWeaponTags: unknown[];
    requiredWeaponTypes: number[];
    statusEffects: StatusEffect[];
    sourceStatusEffects: StatusEffect[];
    damageEffects: DamageEffect[];
    damageRangePercent: number;
    deactivatable: boolean;
    useSimpleTargetingRange: boolean;
    simpleRange: number;
    simpleBlastRange: number;
    useSimpleTargetingBlast: boolean;
    blastRange: string;
    targetGlobal: boolean;
    rangeSelection: string;
    useGroundEffect: boolean;
    groundDuration: number;

    constructor(data: any) {
        this.name = data.name ?? '';
        this.overrideDescriptionAndName = data.OverrideDescriptionAndName ?? false;
        this.description = data.Description ?? '';
        this.descriptionExpressions = data.DescriptionExpressions ?? [];
        this.damageExpressionOverrides = data.DamageExpressionOverrides ?? [];
        this.ignoreSourceStatus = data.IgnoreSourceStatus ?? false;
        this.skipTextAndAnimation = data.SkipTextAndAnimation ?? false;
        this.overrideActionName = data.OverrideActionName ?? false;
        this.actionNameOverride = data.ActionNameOverride ?? '';
        this.overrideSkillType = data.OverrideSkillType ?? false;
        this.overrideDamageStatType = data.OverrideDamageStatType ?? false;
        this.useActionChances = data.UseActionChances ?? false;
        this.targetTextOverride = data.TargetTextOverride ?? '';
        this.useMaxRangeOverride = data.UseMaxRangeOverride ?? false;
        this.maxRangeOverride = data.MaxRangeOverride ?? 0;
        this.useMaxRangeBlastOverride = data.UseMaxRangeBlastOverride ?? false;
        this.maxRangeBlastOverride = data.MaxRangeBlastOverride ?? 0;
        this.useKnockback = data.UseKnockback ?? false;
        this.knockbackAmount = data.KnockbackAmount ?? 0;
        this.useMultipleHits = data.UseMultipleHits ?? false;
        this.numHits = data.NumHits ?? 1;
        this.multipleHitRange = data.MultipleHitRange ?? '';
        this.useNumHitsEquation = data.UseNumHitsEquation ?? false;
        this.numHitsEquation = data.NumHitsEquation ?? '';
        this.hitInterval = data.HitInterval ?? 0;
        this.multipleHitTarget = data.MultipleHitTarget ?? '';
        this.multipleHitTargetOrderBy = data.MultipleHitTargetOrderBy ?? '';
        this.multipleHitTargetRandomize = data.MultipleHitTargetRandomize ?? false;
        this.useCondition = data.UseCondition ?? '';
        this.useConditionFailText = data.UseConditionFailText ?? '';
        this.cooldown = data.Cooldown ?? '';
        this.hasCharges = data.HasCharges ?? false;
        this.maxCharges = data.MaxCharges ?? '';
        this.initialCharges = data.InitialCharges ?? '';
        this.chargesPerBattle = data.ChargesPerBattle ?? '';
        this.startingBattleCharges = data.StartingBattleCharges ?? '';
        this.restoreAllChargesOnTownReturn = data.RestoreAllChargesOnTownReturn ?? false;
        this.cost = data.Cost ?? '';
        this.manaCostRatio = data.ManaCostRatio ?? 0;
        this.addWeaponCost = data.AddWeaponCost ?? false;
        this.numCasts = data.NumCasts ?? '';
        this.useGlobalDamageRange = data.UseGlobalDamageRange ?? false;
        this.skillTags = data.SkillTags ?? [];
        this.hasWeaponRequirement = data.HasWeaponRequirement ?? false;
        this.hasWeaponRequirementTypes = data.HasWeaponRequirementTypes ?? false;
        this.hasWeaponRequirementTags = data.HasWeaponRequirementTags ?? false;
        this.costsMana = data.CostsMana ?? false;
        this.manaCost = data.ManaCost ?? 0;
        this.requiredWeaponTags = data.RequiredWeaponTags ?? [];
        this.requiredWeaponTypes = data.RequiredWeaponTypes ?? [];
        this.statusEffects = (data.StatusEffects ?? []).map((e: any) => ({
            name: e.Name ?? '',
            infinite: e.Infinite ?? false,
            duration: e.Duration ?? '',
            expireType: e.ExpireType ?? 0,
        }));
        this.sourceStatusEffects = (data.SourceStatusEffects ?? []).map((e: any) => ({
            name: e.Name ?? '',
            infinite: e.Infinite ?? false,
            duration: e.Duration ?? '',
            expireType: e.ExpireType ?? 0,
        }));
        this.damageEffects = (data.DamageEffects ?? []).map((e: any) => {
            const raw: string = e.RawExpression ?? '';
            const match = raw.match(/(\d+\.?\d*)f/);
            const damageMultiplier = match ? parseFloat(match[1]) : null;
            return {
                rawExpression: raw,
                statType: e.StatType ?? '',
                coefficient: e.Coefficient ?? 0,
                effectType: e.EffectType ?? '',
                damageMultiplier,
            };
        });
        this.damageRangePercent = data.DamageRangePercent ?? 0;
        this.deactivatable = data.Deactivatable ?? false;
        this.useSimpleTargetingRange = data.UseSimpleTargetingRange ?? false;
        this.simpleRange = data.SimpleRange ?? 0;
        this.simpleBlastRange = data.SimpleBlastRange ?? 0;
        this.useSimpleTargetingBlast = data.UseSimpleTargetingBlast ?? false;
        this.blastRange = data.BlastRange ?? '';
        this.targetGlobal = data.TargetGlobal ?? false;
        this.rangeSelection = data.RangeSelection ?? '';
        this.useGroundEffect = data.UseGroundEffect ?? false;
        this.groundDuration = data.GroundDuration ?? 0;
    }
}
