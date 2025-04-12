import { Link } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  step: 1 | 2 | 3;
  title: string;
  backLink?: string;
}

export default function BookingProgress({ step, title, backLink }: BookingProgressProps) {
  const steps = [
    { number: 1, label: "Select Seats" },
    { number: 2, label: "Customer Details" },
    { number: 3, label: "Payment" },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        {backLink && (
          <div className="flex items-center mb-4">
            <Link 
              href={backLink} 
              className="text-primary flex items-center hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back</span>
            </Link>
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold font-heading">{title}</h1>
        </div>
        <div className="flex justify-between items-center mt-6 max-w-3xl mx-auto">
          {steps.map((s) => (
            <div 
              key={s.number}
              className={cn(
                "progress-step flex flex-col items-center w-1/3",
                step >= s.number && "active"
              )}
            >
              <div 
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full relative z-10",
                  step > s.number 
                    ? "bg-primary text-white" 
                    : step === s.number 
                      ? "bg-primary text-white" 
                      : "bg-gray-300 text-gray-600"
                )}
              >
                {step > s.number ? (
                  <Check className="h-3 w-3" />
                ) : (
                  s.number
                )}
              </div>
              <span className="text-sm mt-2 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style jsx="true">{`
        .progress-step {
          position: relative;
        }
        .progress-step:not(:last-child):after {
          content: '';
          position: absolute;
          top: 12px;
          left: 100%;
          width: 100%;
          height: 2px;
          background-color: #E2E8F0;
          z-index: 0;
        }
        .progress-step.active:not(:last-child):after {
          background-color: #E53E3E;
        }
      `}</style>
    </div>
  );
}
