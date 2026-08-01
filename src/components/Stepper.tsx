"use client";

import {
  Children,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Check } from "@phosphor-icons/react";

type IndicatorRenderProps = {
  step: number;
  currentStep: number;
  onStepClick: (step: number) => void;
};

type StepperProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: IndicatorRenderProps) => ReactNode;
};

const stepVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? "50%" : "-50%", opacity: 0 }),
};

export function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => undefined,
  onFinalStepCompleted = () => undefined,
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  completeButtonText = "Complete",
  disableStepIndicators = false,
  renderStepIndicator,
  className = "",
  ...rest
}: StepperProps) {
  const steps = Children.toArray(children);
  const totalSteps = steps.length;
  const safeInitialStep = Math.min(Math.max(initialStep, 1), Math.max(totalSteps, 1));
  const [currentStep, setCurrentStep] = useState(safeInitialStep);
  const [direction, setDirection] = useState(0);
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (nextStep: number) => {
    setCurrentStep(nextStep);
    if (nextStep > totalSteps) onFinalStepCompleted();
    else onStepChange(nextStep);
  };

  const moveToStep = (nextStep: number) => {
    if (nextStep === currentStep || disableStepIndicators) return;
    setDirection(nextStep > currentStep ? 1 : -1);
    updateStep(nextStep);
  };

  const restart = () => {
    setDirection(-1);
    updateStep(1);
  };

  return (
    <div className={`rb-stepper ${className}`.trim()} {...rest}>
      <div className={`rb-stepper-shell ${stepCircleContainerClassName}`.trim()}>
        <div className={`rb-stepper-indicators ${stepContainerClassName}`.trim()} aria-label="Project path">
          {steps.map((_, index) => {
            const step = index + 1;
            const clickStep = () => moveToStep(step);
            return (
              <div className="rb-stepper-indicator-group" key={step}>
                {renderStepIndicator ? renderStepIndicator({ step, currentStep, onStepClick: moveToStep }) : (
                  <StepIndicator
                    step={step}
                    currentStep={currentStep}
                    disabled={disableStepIndicators}
                    onClick={clickStep}
                  />
                )}
                {step < totalSteps && <StepConnector complete={currentStep > step} />}
              </div>
            );
          })}
        </div>

        {isCompleted ? (
          <motion.div className="rb-stepper-complete" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
            <Check size={28} weight="bold" aria-hidden="true" />
            <div><h2>Every stage explored.</h2><p>The full ten-step production detail continues below.</p></div>
            <button type="button" onClick={restart}>Review again</button>
          </motion.div>
        ) : (
          <>
            <StepContent currentStep={currentStep} direction={direction} className={contentClassName}>
              {steps[currentStep - 1]}
            </StepContent>
            <div className={`rb-stepper-footer ${footerClassName}`.trim()}>
              <div className="rb-stepper-progress" aria-live="polite">{currentStep} of {totalSteps}</div>
              <div className="rb-stepper-actions">
                {currentStep > 1 && <button type="button" className="rb-stepper-back" onClick={() => { setDirection(-1); updateStep(currentStep - 1); }} {...backButtonProps}>{backButtonText}</button>}
                <button
                  type="button"
                  className="rb-stepper-next"
                  onClick={() => { setDirection(1); updateStep(isLastStep ? totalSteps + 1 : currentStep + 1); }}
                  {...nextButtonProps}
                >
                  {isLastStep ? completeButtonText : nextButtonText}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepContent({ currentStep, direction, children, className }: { currentStep: number; direction: number; children: ReactNode; className: string }) {
  const [height, setHeight] = useState(260);
  const handleHeight = useCallback((nextHeight: number) => setHeight(nextHeight), []);

  return (
    <motion.div className={`rb-stepper-content ${className}`.trim()} animate={{ height }} transition={{ type: "spring", duration: .45, bounce: .12 }}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <SlideTransition key={currentStep} direction={direction} onHeightReady={handleHeight}>{children}</SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }: { children: ReactNode; direction: number; onHeightReady: (height: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reportHeight = () => onHeightReady(element.offsetHeight);
    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, onHeightReady]);

  return (
    <motion.div ref={ref} className="rb-stepper-slide" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: .4, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function StepIndicator({ step, currentStep, disabled, onClick }: { step: number; currentStep: number; disabled: boolean; onClick: () => void }) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";
  return (
    <motion.button
      type="button"
      className="rb-stepper-indicator"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Go to project stage ${step}`}
      aria-current={status === "active" ? "step" : undefined}
      animate={status}
      initial={false}
      variants={{ inactive: { backgroundColor: "#111111", color: "#a1a1aa" }, active: { backgroundColor: "#f4f4f4", color: "#050505" }, complete: { backgroundColor: "#f4f4f4", color: "#050505" } }}
      transition={{ duration: .3 }}
    >
      {status === "complete" ? <Check size={15} weight="bold" aria-hidden="true" /> : <span>{step}</span>}
    </motion.button>
  );
}

function StepConnector({ complete }: { complete: boolean }) {
  return <span className="rb-stepper-connector" aria-hidden="true"><motion.i initial={false} animate={{ scaleX: complete ? 1 : 0 }} transition={{ duration: .4 }} /></span>;
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="rb-stepper-step">{children}</div>;
}
