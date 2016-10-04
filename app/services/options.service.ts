import {Injectable} from '@angular/core';

@Injectable()
export class OptionsService {

    constructor() { }

    public identificationTypeOptions = [
        "Sitework", 
        "ADA", 
        "Zone",
        "Other"];

    public zoneTypeOptions = [
        "Primary",
        "Secondary",
        "Access & Delivery",
        "Dead",
        "Other"
    ];

    public siteworkTypeOptions = [
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

    public adaTypeOptions = [
        "Parking",
        "Curb Ramp",
        "Site Ramp",
        "Other"];

    public materialOptions = [
        "Concrete",
        "Asphalt",
        "Block",
        "Other"];

    public failureModeOptions = [
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
        "Other"];

    public ratingOptions = [
        "Minor",
        "Moderate",
        "Severe",
        "-"];

    public causeOptions = [
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