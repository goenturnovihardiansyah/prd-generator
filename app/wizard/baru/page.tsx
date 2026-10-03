"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { createPrd, takePendingIdea } from "@/lib/store";
import type { WizardAnswers } from "@/lib/types";

function CreateAndRedirect() {
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const idea = takePendingIdea();
    const answers: WizardAnswers = {};
    if (idea?.text) answers["1.2"] = { jawaban: idea.text, dilewati: false };
    if (idea?.type) answers["1.3"] = { jawaban: idea.type, dilewati: false };
    const prd = createPrd({ wizard_answers: answers });
    router.replace(`/wizard/${prd.id}`);
  }, [router]);

  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <div className="spinner" aria-label="Menyiapkan wizard" />
    </div>
  );
}

export default function NewWizardPage() {
  return (
    <RequireAuth>
      <CreateAndRedirect />
    </RequireAuth>
  );
}
