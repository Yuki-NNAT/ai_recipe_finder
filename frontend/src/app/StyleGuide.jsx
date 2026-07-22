import { useState } from 'react';
import {
  ChefHat,
  Search,
  Sparkles,
  Users,
  Flame,
  Heart,
  Mail,
  Settings,
  MessageCircle,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Card,
  RecipeCard,
  StatCard,
  Avatar,
  Badge,
  Chip,
  Progress,
  Pagination,
  Tabs,
  Modal,
  Drawer,
  Loading,
  RecipeCardSkeleton,
  EmptyState,
  ErrorState,
  notify,
  Section,
  Display,
  Title,
  Text,
  Muted,
  Eyebrow,
  SectionHeading,
} from '@/ui';

const DEMO_RECIPES = [
  {
    id: '1',
    title: 'Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    rating: 4.8,
    calories: 420,
    time: 25,
    tag: 'Popular',
  },
  {
    id: '2',
    title: 'Creamy Chicken Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    rating: 4.7,
    calories: 520,
    time: 30,
    tag: 'Popular',
  },
  {
    id: '3',
    title: 'Lemon Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    rating: 4.9,
    calories: 450,
    time: 20,
  },
  {
    id: '4',
    title: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80',
    rating: 4.6,
    calories: 320,
    time: 10,
  },
];

function Block({ label, children }) {
  return (
    <Card className="space-y-4">
      <Eyebrow>{label}</Eyebrow>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </Card>
  );
}

/**
 * Living style guide, rendered inside MainLayout so it doubles as a preview of
 * the real app shell (sidebar + glass navbar). Replaced by the Home page and
 * router wiring in later modules.
 */
export default function StyleGuide() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState('grid');
  const [page, setPage] = useState(2);
  const [favorites, setFavorites] = useState(['1']);

  const toggleFav = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div className="space-y-6">
      {/* Hero banner (dashboard-style) */}
      <div className="relative overflow-hidden rounded-3xl bg-hero-glow p-8 sm:p-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 shadow-soft-sm">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">AI Recipe</span>
          </div>
          <Display className="mt-5">
            AI Recipe <span className="text-gradient">Finder</span>
          </Display>
          <Text className="mt-3 text-ink/70">
            AI-powered recipe recommendation, nutrition analysis and calorie calculator.
          </Text>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" leftIcon={<Search className="h-5 w-5" />}>
              Explore Recipes
            </Button>
            <Button size="lg" variant="secondary" leftIcon={<MessageCircle className="h-5 w-5" />}>
              Start AI Chat
            </Button>
          </div>
        </div>
        <ChefHat className="pointer-events-none absolute -right-6 top-8 h-40 w-40 rotate-12 text-primary-200/60" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ChefHat className="h-6 w-6" />} label="Recipes" value={1248} compact />
        <StatCard icon={<Users className="h-6 w-6" />} label="Active users" value={8400} compact tone="secondary" trend={12} />
        <StatCard icon={<Flame className="h-6 w-6" />} label="Meals analyzed" value={32100} compact tone="warning" trend={8} />
        <StatCard icon={<Heart className="h-6 w-6" />} label="Saved recipes" value={5620} compact tone="success" trend={-3} />
      </div>

      {/* Recipe grid */}
      <Section spacing="sm" className="space-y-5">
        <SectionHeading title="Popular Recipes" action={<Button variant="soft" size="sm">View all</Button>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_RECIPES.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              isFavorite={favorites.includes(r.id)}
              onToggleFavorite={toggleFav}
            />
          ))}
        </div>
      </Section>

      {/* Buttons & controls */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Block label="Buttons">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <IconButton label="Settings" variant="soft">
            <Settings className="h-5 w-5" />
          </IconButton>
        </Block>

        <Block label="Badges, chips & avatars">
          <Badge>New</Badge>
          <Badge tone="solid">Popular</Badge>
          <Badge tone="success">Healthy</Badge>
          <Badge tone="warning">420 kcal</Badge>
          <Chip active>Breakfast</Chip>
          <Chip>Lunch</Chip>
          <Chip onRemove={() => notify.info('Removed filter')}>Vegan</Chip>
          <Avatar name="Nhi Nguyen" status="online" />
        </Block>
      </div>

      {/* Forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <Eyebrow>Form controls</Eyebrow>
          <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-5 w-5" />} />
          <Input label="With error" placeholder="Try me" error="This field is required" />
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} />
          <Select
            label="Category"
            placeholder="Choose a category"
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
            ]}
          />
          <Textarea label="Notes" placeholder="Add cooking notes…" />
        </Card>

        <Card className="space-y-5">
          <Eyebrow>Toggles & progress</Eyebrow>
          <div className="flex flex-wrap gap-6">
            <Checkbox label="Gluten free" defaultChecked />
            <Radio name="diet" label="Vegan" defaultChecked />
            <Radio name="diet" label="Keto" />
            <Switch label="Daily reminders" defaultChecked />
          </div>
          <Progress label="Protein" value={68} showValue />
          <Progress label="Carbs" value={45} tone="warning" showValue />
          <Progress label="Daily goal" value={82} tone="success" showValue />
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'grid', label: 'Grid' },
              { value: 'list', label: 'List' },
              { value: 'map', label: 'Map' },
            ]}
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="soft" size="sm" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button variant="soft" size="sm" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
            <Button variant="soft" size="sm" onClick={() => notify.success('Saved to favorites')}>
              Toast
            </Button>
          </div>
        </Card>
      </div>

      {/* Feedback states */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card padded={false} className="overflow-hidden">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <RecipeCardSkeleton />
            <RecipeCardSkeleton />
          </div>
        </Card>
        <Card padded={false}>
          <EmptyState
            title="No favorites yet"
            description="Save recipes you love and they’ll show up here."
            action={<Button size="sm">Browse recipes</Button>}
          />
        </Card>
        <Card padded={false}>
          <ErrorState onRetry={() => notify.info('Retrying…')} />
        </Card>
      </div>

      <Card className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="space-y-1">
          <Title>Typography & loading</Title>
          <Muted>Shared heading, title, text and spinner styles.</Muted>
        </div>
        <Loading className="py-0" label="Fetching recipes…" />
        <Pagination page={page} totalPages={9} onChange={setPage} />
      </Card>

      {/* Overlays */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add to meal plan"
        description="Pick a day to schedule this recipe."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false);
                notify.success('Added to Monday');
              }}
            >
              Add to plan
            </Button>
          </>
        }
      >
        <p>This is the shared Modal — used for confirmations and quick actions.</p>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" side="right">
        <div className="space-y-4 p-5">
          <Muted>Refine your recipe search.</Muted>
          <div className="flex flex-wrap gap-2">
            <Chip active>All</Chip>
            <Chip>Vegan</Chip>
            <Chip>Low carb</Chip>
            <Chip>High protein</Chip>
          </div>
          <Progress label="Max calories" value={60} showValue />
        </div>
      </Drawer>
    </div>
  );
}
