
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarHeaderProps {
  date: Date;
  title: string;
}

export const CalendarHeader = ({ date, title }: CalendarHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-medBlue">{title}</h2>
      <p className="text-gray-500">
        {format(date, "EEEE d MMMM yyyy", { locale: fr })}
      </p>
    </div>
  );
};
