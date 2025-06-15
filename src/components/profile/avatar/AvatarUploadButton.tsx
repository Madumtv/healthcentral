
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";

interface AvatarUploadButtonProps {
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarUploadButton({ uploading, onFileChange }: AvatarUploadButtonProps) {
  return (
    <div className="absolute -bottom-2 -right-2">
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <Button
          type="button"
          size="sm"
          className="rounded-full p-2 h-8 w-8"
          disabled={uploading}
          asChild
        >
          <span>
            {uploading ? (
              <Upload className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </span>
        </Button>
      </label>
      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}
