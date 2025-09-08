
"use client";

import * as React from "react";
import { DollarSign, Users, Minus, Plus, Percent } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TipRecommender } from "@/components/tip-recommender";
import { cn } from "@/lib/utils";

export function TipCalculator() {
  const [bill, setBill] = React.useState("100");
  const [tipPercentage, setTipPercentage] = React.useState("18");
  const [customTip, setCustomTip] = React.useState("");
  const [people, setPeople] = React.useState("2");

  const [totalPerPerson, setTotalPerPerson] = React.useState("0.00");
  const [tipAmount, setTipAmount] = React.useState("0.00");

  const isCustomTip = tipPercentage === "custom";

  React.useEffect(() => {
    const billAmount = parseFloat(bill);
    const numPeople = parseInt(people, 10);
    const tip = isCustomTip ? parseFloat(customTip) : parseFloat(tipPercentage);

    if (billAmount > 0 && numPeople > 0 && tip >= 0) {
      const tipValue = billAmount * (tip / 100);
      const totalValue = billAmount + tipValue;
      const perPersonValue = totalValue / numPeople;

      setTipAmount(tipValue.toFixed(2));
      setTotalPerPerson(perPersonValue.toFixed(2));
    } else {
      setTipAmount("0.00");
      setTotalPerPerson("0.00");
    }
  }, [bill, tipPercentage, customTip, people, isCustomTip]);
  
  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    return isNaN(number) ? '$0.00' : number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const handlePeopleChange = (change: number) => {
    setPeople((prev) => String(Math.max(1, parseInt(prev, 10) + change)));
  };

  const handleSetRecommendedTip = (recommendedTip: number) => {
    setTipPercentage('custom');
    setCustomTip(String(recommendedTip));
  };


  return (
    <Card className="w-full shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-headline font-bold text-accent">TipsRamdom JB</CardTitle>
        <CardDescription>Calculate tips and split bills with ease.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bill">Bill Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="bill"
              type="number"
              placeholder="0.00"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Tip %</Label>
          <Tabs value={tipPercentage} onValueChange={setTipPercentage} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
              {["15", "18", "20", "25"].map((tip) => (
                <TabsTrigger key={tip} value={tip} className="text-base">
                  {tip}%
                </TabsTrigger>
              ))}
              <TabsTrigger value="custom" className="text-base">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="custom" className="mt-4">
               <div className="relative">
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g. 22"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="pr-10 text-lg"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="people">Number of People</Label>
          <div className="relative flex items-center">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="people"
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="pl-10 text-center text-lg"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
               <Button variant="ghost" size="icon" onClick={() => handlePeopleChange(-1)} disabled={parseInt(people, 10) <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handlePeopleChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TipRecommender onSetTip={handleSetRecommendedTip} />

      </CardContent>
      <CardFooter className="bg-accent/90 text-accent-foreground rounded-b-lg p-6">
        <div className="w-full space-y-4">
           <div className="flex justify-between items-center transition-all duration-300">
            <div className="text-lg">
              <p>Total Tip</p>
              <p className="text-xs font-light opacity-80">The amount to thank your server</p>
            </div>
            <p className={cn("text-3xl font-bold font-mono transition-all duration-300", parseFloat(tipAmount) > 0 ? "text-primary-foreground" : "text-primary-foreground/50")}>
              {formatCurrency(tipAmount)}
            </p>
          </div>
          <div className="flex justify-between items-center transition-all duration-300">
            <div className="text-lg">
              <p>Total per person</p>
              <p className="text-xs font-light opacity-80">Each person's share of the bill</p>
            </div>
            <p className={cn("text-3xl font-bold font-mono transition-all duration-300", parseFloat(totalPerPerson) > 0 ? "text-primary-foreground" : "text-primary-foreground/50")}>
              {formatCurrency(totalPerPerson)}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
