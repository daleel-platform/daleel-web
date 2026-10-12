interface PasswordRulesListProps {
  password: string;
}

export function PasswordRulesList({ password }: PasswordRulesListProps) {
  const rules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    {
      label: 'One special character (!@#$...)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1 text-xs">
      {rules.map((rule) => (
        <div
          key={rule.label}
          className={`flex items-center gap-1.5 transition-colors ${
            rule.met ? 'text-emerald-600 font-medium' : 'text-slate-400'
          }`}
        >
          {rule.met ? (
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span className="ml-1 mr-1 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
          )}
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
}
