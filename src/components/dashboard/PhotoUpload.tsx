import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  url: string;
  display_order: number;
}

interface PhotoUploadProps {
  motelId: string | null;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  tempPhotos: File[];
  onTempPhotosChange: (files: File[]) => void;
  isPremium?: boolean;
}

const MAX_PHOTOS_FREE = 5;
const MAX_PHOTOS_PREMIUM = 20;

export function PhotoUpload({
  motelId,
  photos,
  onPhotosChange,
  tempPhotos,
  onTempPhotosChange,
  isPremium = false,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const maxPhotos = isPremium ? MAX_PHOTOS_PREMIUM : MAX_PHOTOS_FREE;
  const currentPhotoCount = photos.length + tempPhotos.length;
  const canAddMore = currentPhotoCount < maxPhotos;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check photo limit
    const remainingSlots = maxPhotos - currentPhotoCount;
    if (files.length > remainingSlots) {
      toast({
        variant: "destructive",
        title: "Limite de fotos",
        description: `Você pode adicionar apenas mais ${remainingSlots} foto(s). ${!isPremium ? "Faça upgrade para Premium e adicione até 20 fotos!" : ""}`,
      });
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Apenas imagens JPG, PNG ou WebP são permitidas.",
      });
    }

    if (motelId) {
      // Upload directly if we have a motel ID
      uploadPhotos(validFiles);
    } else {
      // Store temporarily if no motel ID yet
      onTempPhotosChange([...tempPhotos, ...validFiles]);
    }
  };

  const uploadPhotos = async (files: File[]) => {
    if (!motelId) return;

    setUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${motelId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("motel-photos")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("motel-photos")
          .getPublicUrl(fileName);

        // Insert into motel_photos table
        const { data: photoData, error: insertError } = await supabase
          .from("motel_photos")
          .insert({
            motel_id: motelId,
            url: urlData.publicUrl,
            display_order: photos.length,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        onPhotosChange([...photos, photoData]);
      }

      toast({
        title: "Sucesso!",
        description: "Fotos enviadas com sucesso.",
      });
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar as fotos.",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photo: Photo) => {
    try {
      // Extract file path from URL
      const urlParts = photo.url.split("/motel-photos/");
      if (urlParts.length > 1) {
        await supabase.storage.from("motel-photos").remove([urlParts[1]]);
      }

      // Delete from database
      await supabase.from("motel_photos").delete().eq("id", photo.id);

      onPhotosChange(photos.filter((p) => p.id !== photo.id));

      toast({
        title: "Foto removida",
        description: "A foto foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Error removing photo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a foto.",
      });
    }
  };

  const removeTempPhoto = (index: number) => {
    onTempPhotosChange(tempPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
        Fotos do Motel
      </h4>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing photos */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden border border-border/50 group"
          >
            <img
              src={photo.url}
              alt="Foto do motel"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(photo)}
              className="absolute top-2 right-2 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        {/* Temporary photos (for new motels) */}
        {tempPhotos.map((file, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-border/50 group"
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeTempPhoto(index)}
              className="absolute top-2 right-2 p-1 bg-destructive/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

      {/* Upload button */}
        {canAddMore && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Adicionar</span>
              </>
            )}
          </label>
        )}
      </div>

      {/* Photo counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          <ImageIcon className="w-3 h-3 inline mr-1" />
          {currentPhotoCount}/{maxPhotos} fotos
        </span>
        {!isPremium && currentPhotoCount >= MAX_PHOTOS_FREE && (
          <span className="text-primary">
            Faça upgrade para Premium e adicione até 20 fotos!
          </span>
        )}
      </div>

      {!motelId && tempPhotos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {tempPhotos.length} foto(s) serão enviadas após salvar o motel.
        </p>
      )}
    </div>
  );
}
