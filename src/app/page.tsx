"use client";

import type { Advocate } from "@/db/schema";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AdvocatesResponse {
  data: Advocate[];
  pagination: PaginationInfo;
}

const fetchAdvocates = async (
  search: string = "",
  page: number = 1
): Promise<AdvocatesResponse> => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page.toString());
  params.append("limit", "50");

  const url = `/api/advocates?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch advocates");
  return response.json();
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["advocates", debouncedSearchTerm, currentPage],
    queryFn: () => fetchAdvocates(debouncedSearchTerm, currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const advocates = data?.data || [];
  const pagination = data?.pagination;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    console.log("resetting search");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (error) {
    return (
      <main className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="p-8 text-center">
          <p className="text-red-500">
            Error loading advocates. Please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 bg-solace-primary -m-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Solace Advocates
          </h1>
          <a
            href="/admin"
            className="px-4 py-2 bg-solace-accent-gold text-solace-primary rounded-md hover:bg-white transition-colors font-medium"
          >
            Add New Advocate
          </a>
        </div>
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
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={onChange}
                placeholder="Search by name, city, degree, specialty, or experience..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-solace-primary focus:border-solace-primary transition-colors bg-white"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-solace-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClick}
            type="button"
            className="px-6 py-2 bg-solace-primary text-white rounded-md hover:bg-solace-primary-focused transition-colors font-medium"
          >
            Reset Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
            <div className="flex items-center text-sm text-blue-700">
              <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full mr-2"></div>
              Finding advocates
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {pagination && (
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} advocates
              </span>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
          </div>
        )}

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
              {advocates.map((advocate, index) => {
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

        {advocates.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No advocates found matching your search."
                : "No advocates found."}
            </p>
          </div>
        )}

        {advocates.length === 0 && isLoading && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading advocates...</p>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      pageNum === currentPage
                        ? "bg-solace-primary text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
