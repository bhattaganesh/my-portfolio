import { Container } from '@/components/ui/container';

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl w-1/3" />
          <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-1/2" />
          <div className="h-4 bg-surface-200 dark:bg-surface-800 rounded w-2/3" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-video bg-surface-200 dark:bg-surface-800 rounded-xl" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
