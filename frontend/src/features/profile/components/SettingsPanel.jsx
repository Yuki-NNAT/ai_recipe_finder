import { LogOut } from 'lucide-react';
import { Card, Title, Switch, Chip, Button, notify } from '@/ui';

const DIETS = ['Vegetarian', 'Vegan', 'Keto', 'Gluten free', 'Low carb', 'High protein'];

/** Account & preference settings. */
export default function SettingsPanel({ onLogout }) {
  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <Title>Notifications</Title>
        <Switch label="Email me weekly nutrition reports" defaultChecked />
        <Switch label="New recipe recommendations" defaultChecked />
        <Switch label="Meal plan reminders" />
      </Card>

      <Card className="space-y-4">
        <Title>Dietary preferences</Title>
        <p className="text-sm text-muted">Tell the AI how to tailor recommendations.</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <Chip key={d} onClick={() => notify.info(`Toggled ${d}`)}>
              {d}
            </Chip>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <Title>Account</Title>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => notify.info('Password reset link sent')}>
            Change password
          </Button>
          <Button variant="danger" leftIcon={<LogOut className="h-4 w-4" />} onClick={onLogout}>
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
