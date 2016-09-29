import {Injectable} from '@angular/core';

@Injectable()
export class OptionsService {

    constructor() { }

    public identificationTypeOptions = [
        "Sitework", 
        "ADA", 
        "Other"];

    public static typeOptions = [
        "Parking Lot",
        "Sidewalk",
        "Slab on Grade",
        "Curb",
        "Bollard",
        "Bollard Sleeve",
        "Pavement Markings",
        "Catch Basin",
        "Drain Inlet",
        "Signage",
        "Misc."];

    public static adaTypeOptions = [
        "Parking",
        "Curb Ramp",
        "Site Ramp",
        "Other"];

    public static materialOptions = [
        "Concrete",
        "Asphalt",
        "Block",
        "Other"];

    public static failureOptions = [
        "Oil Degradation",
        "Potholes",
        "Rutting",
        "Distortion",
        "Raveling",
        "Scaling",
        "Joint Seal Damage",
        "Cracking",
        "Crack Spalling",
        "Faulting",
        "Settlement",
        "Cracking",
        "Other"];

    public static ratingOptions = [
        "Minor",
        "Moderate",
        "Severe",
        "-"];

    public static causeOptions = [
        "Vehicle Deposits",
        "Fatigue",
        "Traffic Loading",
        "Poor Drainage",
        "Mix Design",
        "Base Compaction",
        "Weather",
        "Aging",
        "Application",
        "Other"];

    public static recommendedRepairOptions = [
        "No Action",
        "Mill/Overlay",
        "Full Depth Replacement",
        "Full Depth Replacement w/ Base Repair",
        "Concrete Replacement",
        "Repeace Sealant",
        "Epoxy Crack Repair",
        "Concrete Patch",
        "Concrete Replacement",
        "Other"];

    public static unitOptions = [
        "SF",
        "LF",
        "Each",
        "-"];


}