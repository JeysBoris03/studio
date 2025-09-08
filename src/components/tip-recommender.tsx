
"use client";

import * as React from "react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTipRecommendation } from "@/actions/recommend-tip";
import type { RecommendTipAmountOutput } from "@/ai/flows/recommend-tip-amount";
import { useToast } from "@/hooks/use-toast";

interface TipRecommenderProps {
  onSetTip: (tip: number) => void;
}

interface RecommendationState extends RecommendTipAmountOutput {
  lowConfidence?: boolean;
}

export function TipRecommender({ onSetTip }: TipRecommenderProps) {
  const [restaurantName, setRestaurantName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [recommendation, setRecommendation] = React.useState<RecommendationState | null>(null);
  const { toast } = useToast();

  const handleRecommendation = async () => {
    if (!restaurantName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a restaurant name.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await getTipRecommendation({ restaurantName });
      if (result.confidence >= 0.7) {
        setRecommendation(result);
      } else {
        setRecommendation({ ...result, lowConfidence: true });
      }
    } catch (error) {
      toast({
        title: "An Error Occurred",
        description: "Could not fetch a tip recommendation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTip = () => {
    if (recommendation && !recommendation.lowConfidence) {
        const tipPercentage = Math.round(recommendation.tipPercentage * 100);
        onSetTip(tipPercentage);
        toast({
            title: "Tip Applied!",
            description: `${tipPercentage}% has been set as the custom tip.`,
        });
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-accent hover:no-underline">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Tip Recommender</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Get an AI-powered tip suggestion based on customer reviews for the restaurant.
          </p>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter restaurant name..."
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleRecommendation} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suggest"}
            </Button>
          </div>
          {recommendation && (
            <div className="p-4 rounded-md bg-secondary/50 border border-border mt-4 space-y-2">
                {recommendation.lowConfidence ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <div>
                            <p className="font-semibold">Low Confidence</p>
                            <p className="text-sm">We couldn't find enough data for a confident recommendation.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-medium">
                            Based on reviews, we suggest a <span className="font-bold text-accent">{Math.round(recommendation.tipPercentage * 100)}%</span> tip.
                        </p>
                        <p className="text-xs text-muted-foreground italic">"{recommendation.reason}"</p>
                        <Button onClick={handleApplyTip} size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90">
                            Apply this tip
                        </Button>
                    </>
                )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
