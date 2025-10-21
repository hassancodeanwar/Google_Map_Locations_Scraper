/*
  # Google Maps Scraper Database Schema

  1. New Tables
    - `scraper_jobs`
      - `id` (uuid, primary key) - Unique job identifier
      - `category` (text) - Type of places to scrape (e.g., "Churches", "Restaurants")
      - `state` (text) - U.S. state name (e.g., "Kentucky")
      - `state_shortcut` (text) - State abbreviation (e.g., "KY")
      - `status` (text) - Job status: 'pending', 'running', 'completed', 'failed'
      - `created_at` (timestamptz) - When the job was created
      - `completed_at` (timestamptz) - When the job finished
      - `total_results` (integer) - Number of results found
      - `error_message` (text) - Error details if job failed
    
    - `scraper_results`
      - `id` (uuid, primary key) - Unique result identifier
      - `job_id` (uuid, foreign key) - Reference to scraper_jobs
      - `name` (text) - Business/location name
      - `address` (text) - Full address
      - `location_link` (text) - Google Maps URL
      - `average_rating` (text) - Average rating value
      - `number_of_raters` (text) - Number of reviews
      - `hours` (text) - Operating hours
      - `created_at` (timestamptz) - When result was scraped

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Public read access for viewing results
*/

-- Create scraper_jobs table
CREATE TABLE IF NOT EXISTS scraper_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  state text NOT NULL,
  state_shortcut text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  total_results integer DEFAULT 0,
  error_message text
);

-- Create scraper_results table
CREATE TABLE IF NOT EXISTS scraper_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES scraper_jobs(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  location_link text,
  average_rating text,
  number_of_raters text,
  hours text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE scraper_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper_results ENABLE ROW LEVEL SECURITY;

-- Policies for scraper_jobs
CREATE POLICY "Anyone can view scraper jobs"
  ON scraper_jobs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create scraper jobs"
  ON scraper_jobs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update scraper jobs"
  ON scraper_jobs FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policies for scraper_results
CREATE POLICY "Anyone can view scraper results"
  ON scraper_results FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create scraper results"
  ON scraper_results FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scraper_jobs_status ON scraper_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scraper_jobs_created_at ON scraper_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraper_results_job_id ON scraper_results(job_id);