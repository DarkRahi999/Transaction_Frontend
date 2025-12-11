"use client";

import { Button } from "@/components/ui/button";
import { SampleFeature } from "@/components/feature/sample-feature";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { fadeRightAnimation, fadeUpAnimation } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <motion.div className="text-center" {...fadeUpAnimation(20, 0.5, 0)}>
          <motion.h1
            className="text-4xl font-bold tracking-tight"
            {...fadeUpAnimation(20, 0.5, 0.1)}
          >
            Next.js Starter Template
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-muted-foreground"
            {...fadeUpAnimation(20, 0.5, 0.2)}
          >
            A production-ready template with TypeScript, Tailwind CSS, and
            shadcn/ui
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
          {...fadeUpAnimation(30, 0.5, 0.3)}
        >
          <motion.div
            className="space-y-4 md:pt-5"
            {...fadeUpAnimation(-20, 0.5, 0.4)}
          >
            <motion.h2
              className="text-2xl font-semibold"
              {...fadeUpAnimation(15, 0.4, 0.5)}
            >
              Getting Started <ThemeToggle />
            </motion.h2>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              {...fadeUpAnimation(15, 0.4, 0.6)}
            >
              <Button asChild>
                <Link href="https://nextjs.org/docs" target="_blank">
                  Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://ui.shadcn.com/" target="_blank">
                  shadcn/ui
                </Link>
              </Button>
            </motion.div>

            <motion.div className="pt-4" {...fadeUpAnimation(0, 0.4, 0.7)}>
              <p className="text-sm text-muted-foreground">
                Edit this page in{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  src/app/page.tsx
                </code>
              </p>
              <p className="text-sm mt-2">
                Author:
                <i className="px-2 py-1 text-xs">
                  Bisakto Rahi
                </i>
              </p>
            </motion.div>
          </motion.div>

          <motion.div {...fadeRightAnimation(20, 0.5, 0.4)}>
            <SampleFeature />
          </motion.div>
        </motion.div>

        {/* Expense Tracker Preview Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          {...fadeUpAnimation(30, 0.6, 0.5)}
        >
          <motion.h2
            className="text-xl font-semibold mb-4"
            {...fadeUpAnimation(15, 0.4, 0.6)}
          >
            Sample Applications
          </motion.h2>
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6"
            {...fadeUpAnimation(0, 0.4, 0.7)}
          >
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Daily Expense Tracker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Track your income and expenses with our built-in expense tracker application.
            </p>
            <Button asChild>
              <Link href="/expense-tracker">
                Launch Expense Tracker
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 pt-8 border-t border-border"
          {...fadeUpAnimation(30, 0.6, 0.5)}
        >
          <motion.h2
            className="text-xl font-semibold mb-4"
            {...fadeUpAnimation(15, 0.4, 0.6)}
          >
            Features Included
          </motion.h2>
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-left text-sm"
            {...fadeUpAnimation(0, 0.4, 0.7)}
          >
            {[
              "Next.js 15+",
              "TypeScript",
              "Tailwind CSS v4",
              "shadcn/ui Components",
              "Dark Mode",
              "Motion Animation",
              "Responsive Design",
              "Path Aliases",
              "Pre-configured Fonts",
              "ESLint & Prettier",
              "Custom Screen Sizes",
            ].map((feature, index) => (
              <motion.li
                key={feature}
                className="flex items-center"
                {...fadeRightAnimation(-10, 0.3, 0.8 + index * 0.05)}
              >
                <span className="mr-2">✓</span> {feature}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}