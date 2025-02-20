import express, { Request, Response } from "express"; 
import { eq, or } from "drizzle-orm";
import { patients } from "../src/configs/schema"; 
import { db } from "../src/configs";


const router = express.Router();

router.post("/", async (req: Request,res:Response):Promise<void> => {
  try {
    const body = req.body;

    const existingPatient = await db.query.patients.findFirst({
      where: or(
        eq(patients.phoneNumber, body.phoneNumber),
        eq(patients.email, body.email),
        eq(patients.nationalId, body.nationalId)
      ),
    });

    if (existingPatient) {
      return res.status(400).json({ error: "Patient already exists" });
    }

    const result = await db
      .insert(patients)
      .values({
        firstName: body.firstName,
        middleName: body.middleName ?? null,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth).toISOString(),
        gender: body.gender as "Male" | "Female",
        maritalStatus: body.maritalStatus ?? null,
        nationalId: body.nationalId,
        phoneNumber: body.phoneNumber,
        email: body.email ?? null,
        residentialAddress: body.residentialAddress ?? null,
        bloodGroup: body.bloodGroup as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
        allergies: body.allergies ?? null,
        chronicConditions: body.chronicConditions ?? null,
        currentMedications: body.currentMedications ?? null,
        pastMedicalHistory: body.pastMedicalHistory ?? null,
        familyMedicalHistory: body.familyMedicalHistory ?? null,
        insuranceProvider: body.insuranceProvider ?? null,
        insurancePolicyNumber: body.insurancePolicyNumber ?? null,
        nhifNumber: body.nhifNumber ?? null,
        paymentPreference: body.paymentPreference as "Mpesa" | "Insurance" | "Credit Card",
        nextOfKin: body.nextOfKin ?? null,
        nextOfKinRelationship: body.nextOfKinRelationship ?? null,
        nextOfKinContact: body.nextOfKinContact ?? null,
        emergencyName: body.emergencyName ?? null,
        emergencyRelationship: body.emergencyRelationship ?? null,
        emergencyContact: body.emergencyContact ?? null,
        registrationDate: new Date().toISOString(),
      })
      .returning();

    res.status(201).json({ message: "Patient saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const allPatients = await db.select().from(patients);
    res.json(allPatients);
  } catch (error) {
    console.error("Error fetching patients", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
