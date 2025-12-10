// preview page for newly created UI components

import SkeletonCard from '@/components/ui/SkeletonCard'

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>
      <section>
        <h3>SkeletonCard</h3>
        <SkeletonCard />
      </section>
    </div>
  )
}
