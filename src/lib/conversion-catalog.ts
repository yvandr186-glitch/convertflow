/**
 * ConvertFlow — Conversion Catalog
 * Central definition of every supported conversion, tool and category.
 * Used by the landing page, the converter, the command palette and the API.
 */

import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
  BookOpen,
  Code2,
  FileStack,
  Wand2,
  Scissors,
  Lock,
  Shield,
  Stamp,
  Signature,
  Hash,
  FileOutput,
  Trash2,
  RotateCw,
  Crop,
  Scaling,
  Eraser,
  Sparkles,
  Film,
  AudioLines,
  Gauge,
} from "lucide-react";

export type CategoryId =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "archive"
  | "ebook"
  | "developer";

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string; // tailwind gradient classes
  accent: string; // hex
}

export const CATEGORIES: Category[] = [
  {
    id: "image",
    label: "Images",
    description: "PNG, JPG, WebP, AVIF, HEIC, SVG, GIF, BMP, TIFF, ICO",
    icon: ImageIcon,
    color: "from-sky-500 to-blue-600",
    accent: "#2563eb",
  },
  {
    id: "document",
    label: "Documents",
    description: "PDF, DOCX, TXT, HTML, Markdown, PPTX, XLSX, ODT, RTF",
    icon: FileText,
    color: "from-rose-500 to-red-600",
    accent: "#e11d48",
  },
  {
    id: "audio",
    label: "Audio",
    description: "MP3, WAV, FLAC, AAC, OGG, M4A",
    icon: Music,
    color: "from-violet-500 to-purple-600",
    accent: "#7c3aed",
  },
  {
    id: "video",
    label: "Vidéos",
    description: "MP4, WebM, AVI, MOV, MKV, GIF",
    icon: Video,
    color: "from-amber-500 to-orange-600",
    accent: "#ea580c",
  },
  {
    id: "archive",
    label: "Archives",
    description: "ZIP, RAR, 7Z, TAR, GZIP",
    icon: Archive,
    color: "from-emerald-500 to-green-600",
    accent: "#059669",
  },
  {
    id: "ebook",
    label: "eBooks",
    description: "EPUB, PDF, MOBI, AZW3",
    icon: BookOpen,
    color: "from-teal-500 to-cyan-600",
    accent: "#0d9488",
  },
  {
    id: "developer",
    label: "Développeurs",
    description: "JSON, YAML, XML, CSV, SQL",
    icon: Code2,
    color: "from-fuchsia-500 to-pink-600",
    accent: "#c026d3",
  },
];

export interface ConversionDef {
  from: string;
  to: string;
  category: CategoryId;
  /** Whether this conversion is actually executed server-side (sharp) */
  engine: "sharp" | "simulated";
}

/** All supported conversions (from the spec). */
export const CONVERSIONS: ConversionDef[] = [
  // Images — real engine via sharp
  { from: "PNG", to: "JPG", category: "image", engine: "sharp" },
  { from: "JPG", to: "PNG", category: "image", engine: "sharp" },
  { from: "PNG", to: "WEBP", category: "image", engine: "sharp" },
  { from: "WEBP", to: "PNG", category: "image", engine: "sharp" },
  { from: "PNG", to: "AVIF", category: "image", engine: "sharp" },
  { from: "AVIF", to: "PNG", category: "image", engine: "sharp" },
  { from: "HEIC", to: "JPG", category: "image", engine: "simulated" },
  { from: "SVG", to: "PNG", category: "image", engine: "sharp" },
  { from: "SVG", to: "JPG", category: "image", engine: "sharp" },
  { from: "GIF", to: "WEBP", category: "image", engine: "sharp" },
  { from: "BMP", to: "JPG", category: "image", engine: "sharp" },
  { from: "TIFF", to: "JPG", category: "image", engine: "simulated" },
  { from: "ICO", to: "PNG", category: "image", engine: "simulated" },

  // Documents
  { from: "PDF", to: "DOCX", category: "document", engine: "simulated" },
  { from: "DOCX", to: "PDF", category: "document", engine: "simulated" },
  { from: "PDF", to: "TXT", category: "document", engine: "simulated" },
  { from: "TXT", to: "PDF", category: "document", engine: "simulated" },
  { from: "PDF", to: "HTML", category: "document", engine: "simulated" },
  { from: "HTML", to: "PDF", category: "document", engine: "simulated" },
  { from: "Markdown", to: "PDF", category: "document", engine: "simulated" },
  { from: "Markdown", to: "HTML", category: "document", engine: "simulated" },
  { from: "PPTX", to: "PDF", category: "document", engine: "simulated" },
  { from: "XLSX", to: "PDF", category: "document", engine: "simulated" },
  { from: "ODT", to: "PDF", category: "document", engine: "simulated" },
  { from: "RTF", to: "DOCX", category: "document", engine: "simulated" },

  // Audio
  { from: "MP3", to: "WAV", category: "audio", engine: "simulated" },
  { from: "WAV", to: "MP3", category: "audio", engine: "simulated" },
  { from: "FLAC", to: "MP3", category: "audio", engine: "simulated" },
  { from: "AAC", to: "MP3", category: "audio", engine: "simulated" },
  { from: "OGG", to: "MP3", category: "audio", engine: "simulated" },
  { from: "M4A", to: "MP3", category: "audio", engine: "simulated" },

  // Videos
  { from: "MP4", to: "WEBM", category: "video", engine: "simulated" },
  { from: "WEBM", to: "MP4", category: "video", engine: "simulated" },
  { from: "AVI", to: "MP4", category: "video", engine: "simulated" },
  { from: "MOV", to: "MP4", category: "video", engine: "simulated" },
  { from: "MKV", to: "MP4", category: "video", engine: "simulated" },
  { from: "MP4", to: "GIF", category: "video", engine: "simulated" },

  // Archives
  { from: "ZIP", to: "RAR", category: "archive", engine: "simulated" },
  { from: "RAR", to: "ZIP", category: "archive", engine: "simulated" },
  { from: "ZIP", to: "7Z", category: "archive", engine: "simulated" },
  { from: "7Z", to: "ZIP", category: "archive", engine: "simulated" },
  { from: "TAR", to: "ZIP", category: "archive", engine: "simulated" },
  { from: "GZIP", to: "ZIP", category: "archive", engine: "simulated" },

  // eBooks
  { from: "EPUB", to: "PDF", category: "ebook", engine: "simulated" },
  { from: "PDF", to: "EPUB", category: "ebook", engine: "simulated" },
  { from: "MOBI", to: "EPUB", category: "ebook", engine: "simulated" },
  { from: "AZW3", to: "EPUB", category: "ebook", engine: "simulated" },

  // Developer
  { from: "JSON", to: "YAML", category: "developer", engine: "simulated" },
  { from: "YAML", to: "JSON", category: "developer", engine: "simulated" },
  { from: "JSON", to: "XML", category: "developer", engine: "simulated" },
  { from: "XML", to: "JSON", category: "developer", engine: "simulated" },
  { from: "CSV", to: "JSON", category: "developer", engine: "simulated" },
  { from: "JSON", to: "CSV", category: "developer", engine: "simulated" },
  { from: "CSV", to: "SQL", category: "developer", engine: "simulated" },
  { from: "SQL", to: "CSV", category: "developer", engine: "simulated" },
];

/** Get all conversions grouped by category. */
export function conversionsByCategory() {
  return CATEGORIES.map((c) => ({
    category: c,
    conversions: CONVERSIONS.filter((conv) => conv.category === c.id),
  }));
}

/** Target formats available for a given source format. */
export function targetsForFormat(format: string): ConversionDef[] {
  const upper = format.toUpperCase();
  return CONVERSIONS.filter((c) => c.from === upper);
}

/** Detect a format from a file name/extension. */
export function detectFormat(fileName: string): string | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  const map: Record<string, string> = {
    png: "PNG",
    jpg: "JPG",
    jpeg: "JPG",
    webp: "WEBP",
    avif: "AVIF",
    heic: "HEIC",
    svg: "SVG",
    gif: "GIF",
    bmp: "BMP",
    tiff: "TIFF",
    tif: "TIFF",
    ico: "ICO",
    pdf: "PDF",
    docx: "DOCX",
    doc: "DOCX",
    txt: "TXT",
    html: "HTML",
    htm: "HTML",
    md: "Markdown",
    markdown: "Markdown",
    pptx: "PPTX",
    xlsx: "XLSX",
    odt: "ODT",
    rtf: "RTF",
    mp3: "MP3",
    wav: "WAV",
    flac: "FLAC",
    aac: "AAC",
    ogg: "OGG",
    m4a: "M4A",
    mp4: "MP4",
    webm: "WEBM",
    avi: "AVI",
    mov: "MOV",
    mkv: "MKV",
    zip: "ZIP",
    rar: "RAR",
    "7z": "7Z",
    tar: "TAR",
    gz: "GZIP",
    gzip: "GZIP",
    epub: "EPUB",
    mobi: "MOBI",
    azw3: "AZW3",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    xml: "XML",
    csv: "CSV",
    sql: "SQL",
  };
  return map[ext] ?? null;
}

export function categoryOfFormat(format: string): CategoryId | null {
  const upper = format.toUpperCase();
  return CONVERSIONS.find((c) => c.from === upper)?.category ?? null;
}

/** Suggest the best target format for a given source (smart suggestion). */
export function suggestTarget(format: string): string | null {
  const targets = targetsForFormat(format);
  if (targets.length === 0) return null;
  // Prefer modern/optimized formats
  const preference = ["WEBP", "AVIF", "PDF", "PNG", "MP4", "MP3", "ZIP", "JSON"];
  for (const p of preference) {
    const found = targets.find((t) => t.to === p);
    if (found) return found.to;
  }
  return targets[0].to;
}

/* -------------------------------------------------------------------------- */
/* PDF Tools                                                                   */
/* -------------------------------------------------------------------------- */

export interface ToolDef {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  category: "pdf" | "image" | "video";
  color: string;
}

export const PDF_TOOLS: ToolDef[] = [
  { id: "pdf-merge", label: "Fusionner des PDF", description: "Assemblez plusieurs PDF en un seul", icon: FileStack, category: "pdf", color: "from-blue-500 to-indigo-600" },
  { id: "pdf-split", label: "Diviser un PDF", description: "Séparez un PDF en plusieurs fichiers", icon: Scissors, category: "pdf", color: "from-rose-500 to-red-600" },
  { id: "pdf-compress", label: "Compresser un PDF", description: "Réduisez la taille de votre PDF", icon: Gauge, category: "pdf", color: "from-emerald-500 to-green-600" },
  { id: "pdf-unlock", label: "Déverrouiller un PDF", description: "Retirez le mot de passe d'un PDF", icon: Lock, category: "pdf", color: "from-amber-500 to-orange-600" },
  { id: "pdf-protect", label: "Protéger un PDF", description: "Ajoutez un mot de passe à votre PDF", icon: Shield, category: "pdf", color: "from-violet-500 to-purple-600" },
  { id: "pdf-watermark", label: "Filigrane PDF", description: "Ajoutez un filigrane personnalisé", icon: Stamp, category: "pdf", color: "from-cyan-500 to-blue-600" },
  { id: "pdf-sign", label: "Signer un PDF", description: "Ajoutez votre signature électronique", icon: Signature, category: "pdf", color: "from-fuchsia-500 to-pink-600" },
  { id: "pdf-number", label: "Numéroter les pages", description: "Ajoutez des numéros de page", icon: Hash, category: "pdf", color: "from-teal-500 to-cyan-600" },
  { id: "pdf-extract", label: "Extraire des pages", description: "Extrayez des pages spécifiques", icon: FileOutput, category: "pdf", color: "from-sky-500 to-blue-600" },
  { id: "pdf-delete", label: "Supprimer des pages", description: "Retirez les pages inutiles", icon: Trash2, category: "pdf", color: "from-red-500 to-rose-600" },
  { id: "pdf-rotate", label: "Pivoter les pages", description: "Faites pivoter les pages du PDF", icon: RotateCw, category: "pdf", color: "from-indigo-500 to-violet-600" },
  { id: "pdf-organize", label: "Organiser les pages", description: "Réorganisez l'ordre des pages", icon: FileStack, category: "pdf", color: "from-blue-500 to-cyan-600" },
];

export const IMAGE_TOOLS: ToolDef[] = [
  { id: "img-compress", label: "Compresser une image", description: "Réduisez la taille sans perte visible", icon: Gauge, category: "image", color: "from-emerald-500 to-green-600" },
  { id: "img-resize", label: "Redimensionner", description: "Changez les dimensions d'une image", icon: Scaling, category: "image", color: "from-blue-500 to-indigo-600" },
  { id: "img-crop", label: "Rogner une image", description: "Recadrez avec précision", icon: Crop, category: "image", color: "from-amber-500 to-orange-600" },
  { id: "img-rotate", label: "Pivoter une image", description: "Rotation à 90°, 180°, 270°", icon: RotateCw, category: "image", color: "from-violet-500 to-purple-600" },
  { id: "img-bg-remove", label: "Supprimer l'arrière-plan", description: "Retirez le fond automatiquement", icon: Eraser, category: "image", color: "from-fuchsia-500 to-pink-600" },
  { id: "img-watermark", label: "Ajouter un filigrane", description: "Protégez vos images", icon: Stamp, category: "image", color: "from-cyan-500 to-blue-600" },
  { id: "img-optimize", label: "Optimiser", description: "Optimisation intelligente", icon: Sparkles, category: "image", color: "from-teal-500 to-cyan-600" },
  { id: "img-webp", label: "Convertir en WebP", description: "Format moderne du web", icon: ImageIcon, category: "image", color: "from-sky-500 to-blue-600" },
  { id: "img-avif", label: "Convertir en AVIF", description: "Compression next-gen", icon: Wand2, category: "image", color: "from-indigo-500 to-violet-600" },
];

export const VIDEO_TOOLS: ToolDef[] = [
  { id: "vid-compress", label: "Compresser une vidéo", description: "Réduisez la taille de la vidéo", icon: Gauge, category: "video", color: "from-emerald-500 to-green-600" },
  { id: "vid-audio", label: "Extraire l'audio", description: "Récupérez la piste audio", icon: AudioLines, category: "video", color: "from-violet-500 to-purple-600" },
  { id: "vid-gif", label: "Créer un GIF", description: "Transformez une vidéo en GIF", icon: Film, category: "video", color: "from-amber-500 to-orange-600" },
  { id: "vid-snapshot", label: "Capture d'écran", description: "Capturez une image de la vidéo", icon: ImageIcon, category: "video", color: "from-cyan-500 to-blue-600" },
];

export const ALL_TOOLS = [...PDF_TOOLS, ...IMAGE_TOOLS, ...VIDEO_TOOLS];
