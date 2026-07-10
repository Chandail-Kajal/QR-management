"use client"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper"
import { CheckIcon, LoaderCircleIcon } from 'lucide-react'


type Props={
    steps:{title:string}[]
    onStepChange:(step:number)=>void
    currentStep:number
}


export function StepperHeader(props:Props) {
  return (
    <Stepper
      value={props.currentStep}
      onValueChange={props.onStepChange}
      indicators={{
        completed: (
          <CheckIcon  className="size-3.5" />
        ),
        loading: (
          <LoaderCircleIcon  className="size-3.5 animate-spin" />
        ),
        
      }}
      className="w-full max-w-2xl space-y-8"
    >
      <StepperNav>
        {props.steps.map((step, index) => (
          <StepperItem key={index} step={index} className="relative">
            <StepperTrigger className="flex justify-start gap-1.5">
              <StepperIndicator className="">{index + 1}</StepperIndicator>
              <StepperTitle>{step.title}</StepperTitle>
            </StepperTrigger>

            {props.steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-success md:mx-2.5" />
            )}
          </StepperItem>
        ))}
      </StepperNav>


    </Stepper>
  )
}
 