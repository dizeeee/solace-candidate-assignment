"use client";

import type { Advocate } from "@/db/schema";
import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowerCaseSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerCaseSearchTerm) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(lowerCaseSearchTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(lowerCaseSearchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
    console.log("filteredAdvocates", filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 bg-solace-primary -m-6 p-6">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Solace Advocates
        </h1>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Advocates
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={onChange}
              placeholder="Search by name, city, degree, specialty, or experience..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors bg-white"
            />
          </div>
          <button
            onClick={onClick}
            type="button"
            className="px-6 py-2 bg-solace-primary text-white rounded-md hover:bg-solace-primary-focused transition-colors font-medium"
          >
            Reset Search
          </button>
        </div>
        {searchTerm && (
          <p className="mt-3 text-sm text-gray-600">
            Searching for:{" "}
            <span className="font-medium text-gray-900">{searchTerm}</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  First Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  City
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Degree
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Specialties
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Years of Experience
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate, index) => {
                return (
                  <tr
                    key={advocate.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {advocate.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {advocate.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {advocate.city}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {advocate.degree}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {advocate.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {advocate.yearsOfExperience}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {advocate.phoneNumber}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAdvocates.length === 0 && advocates.length > 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No advocates found matching your search.
            </p>
          </div>
        )}

        {advocates.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading advocates...</p>
          </div>
        )}
      </div>
    </main>
  );
}
