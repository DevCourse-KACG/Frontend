interface MyPageCardProps {
    label: string;
    value: string;
  }
  
  export function MyPageCard({ label, value }: MyPageCardProps) {
    return (
      <div className="p-3 border rounded-lg bg-gray-50">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    );
  }
  