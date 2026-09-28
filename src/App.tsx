import './App.css';
import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { Text } from '@/components/text';
import { Card } from '@/components/card';

function App() {
  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <Text variant="h1">Daleel UI Test</Text>
      <Text variant="h2">Daleel UI Test</Text>
      <Text variant="h3">Daleel UI Test</Text>
      <Text variant="body">Daleel UI Test</Text>
      <Text variant="caption">Daleel UI Test</Text>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="primary" loading>
        Loading Button
      </Button>
      <Button variant="secondary" loading>
        Loading Button
      </Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <TextInput
        label="Email"
        placeholder="Enter email"
        helperText="Your work email"
      />
      <TextInput label="Password" type="password" />

      <Card className="max-w-md mx-auto space-y-4">
        <Text variant="h2">Sign in to Daleel</Text>
        <TextInput label="Email Address" placeholder="you@example.com" />
        <TextInput label="Password" type="password" />
        <p className="text-success text-xs font-medium flex items-center gap-1">
          ✓ Password meets all requirements
        </p>
        <TextInput
          label="Email Address"
          error="Please enter a valid email"
          defaultValue="wrong-email"
        />
        <Button variant="primary" className="w-full">
          Sign In
        </Button>
        <Button variant="secondary" className="w-full">
          Sign Up
        </Button>
      </Card>
    </div>
  );
}

export default App;
