// preview page for newly created UI components

import SkeletonCard from "@/components/ui/SkeletonCard";
import HeistsTester from "@/components/HeistsTester";

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>
      <section>
        <h3>Skeleton Card</h3>
        <SkeletonCard />
      </section>
      <section>
        <h3>useHeists Hook</h3>
        <HeistsTester />
      </section>
    </div>
  );
}
