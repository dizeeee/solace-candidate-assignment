"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Advocate } from "@/db/schema";

const SPECIALTIES = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const DEGREES = ["MD", "PhD", "MSW", "LCSW", "LMFT", "LPC", "RN", "NP"];

interface FormData {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
}

const createAdvocate = async (
  advocateData: Omit<FormData, "yearsOfExperience" | "phoneNumber"> & {
    yearsOfExperience: number;
    phoneNumber: number;
  }
): Promise<{ data: Advocate }> => {
  const response = await fetch("/api/advocates/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(advocateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create advocate");
  }

  return response.json();
};

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    city: "",
    degree: "",
    specialties: [],
    yearsOfExperience: "",
    phoneNumber: "",
  });

  const createMutation = useMutation({
    mutationFn: createAdvocate,
    onSuccess: () => {
      // Invalidate and refetch advocates list
      queryClient.invalidateQueries({ queryKey: ["advocates"] });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        city: "",
        degree: "",
        specialties: [],
        yearsOfExperience: "",
        phoneNumber: "",
      });
    },
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      city: formData.city,
      degree: formData.degree,
      specialties: formData.specialties,
      yearsOfExperience: Number(formData.yearsOfExperience) || 0,
      phoneNumber: Number(formData.phoneNumber) || 0,
    });
  };

  return (
    <main className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 bg-solace-primary -m-6 p-6">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Admin - Add New Advocate
        </h1>
        <a
          href="/"
          className="text-solace-accent-gold hover:text-white transition-colors"
        >
          ← Back to Advocates
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {createMutation.isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">
              {createMutation.error?.message || "Failed to create advocate"}
            </p>
          </div>
        )}

        {createMutation.isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Advocate created successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                City *
              </label>
              <input
                id="city"
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="degree"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Degree *
              </label>
              <select
                id="degree"
                required
                value={formData.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              >
                <option value="">Select a degree</option>
                {DEGREES.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Years of Experience *
              </label>
              <input
                id="yearsOfExperience"
                type="number"
                required
                min="0"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  handleInputChange("yearsOfExperience", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="5551234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors"
              />
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-3">
              Specialties * (Select at least one)
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4">
              {SPECIALTIES.map((specialty) => (
                <label key={specialty} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                    className="mt-1 text-solace-primary focus:ring-solace-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
            {formData.specialties.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {formData.specialties.length} specialties
              </p>
            )}
          </fieldset>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  firstName: "",
                  lastName: "",
                  city: "",
                  degree: "",
                  specialties: [],
                  yearsOfExperience: "",
                  phoneNumber: "",
                })
              }
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={
                createMutation.isPending || formData.specialties.length === 0
              }
              className="px-6 py-2 bg-solace-primary text-white rounded-md hover:bg-solace-primary-focused transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? "Creating..." : "Create Advocate"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
