import { Group, Paper, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface BookingProgressCompactProps {
  activeStep: number;
  totalSteps: number;
  title?: string;
  embedded?: boolean;
  minimal?: boolean;
}

const STEP_LABELS = ["Schedule", "Details"];

export const BookingProgressCompact = ({
  activeStep,
  totalSteps,
  title,
  embedded = false,
  minimal = false,
}: BookingProgressCompactProps) => {
  const currentStep = Math.min(activeStep + 1, totalSteps);
  const currentLabel = STEP_LABELS[activeStep] ?? STEP_LABELS[STEP_LABELS.length - 1];
  const progressClassName = minimal
    ? "booking-progress-track booking-progress-track-minimal"
    : "booking-progress-track";

  const content: ReactNode = (
    <>
      <Group justify="space-between" align="center" gap="sm">
        {minimal ? (
          <Text fw={700} fz="sm">
            {currentStep} / {totalSteps}
          </Text>
        ) : (
          <div>
            <Text className="muted-label">Progress</Text>
            <Text fw={700}>
              Step {currentStep} of {totalSteps}
            </Text>
          </div>
        )}

        <Text c="dimmed" fz="sm">
          {currentLabel}
        </Text>
      </Group>

      {!minimal && title ? (
        <Text fw={700} fz="lg" className="booking-progress-title">
          {title}
        </Text>
      ) : null}

      <div
        className={progressClassName}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={
              index <= activeStep
                ? "booking-progress-segment is-active"
                : "booking-progress-segment"
            }
          />
        ))}
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="booking-progress-compact booking-progress-compact-embedded">
        {content}
      </div>
    );
  }

  return (
    <Paper className="surface-card booking-progress-compact" p="md" radius="xl">
      {content}
    </Paper>
  );
};
