/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
  tagline: string;
  details: string[];
  technologies: string[];
  projectUrl?: string;
}

export interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
  coordinates: string;
  date: string;
}

export interface Experiment {
  id: string;
  title: string;
  description: string;
  tech: string;
}
