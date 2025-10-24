import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";

const getDifficultyColor = (level: string) => {
  switch (level) {
    case "easy": return "bg-green-100 text-green-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "hard": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level) {
    case "easy": return "Dễ";
    case "medium": return "Trung bình";
    case "hard": return "Khó";
    default: return level;
  }
};

export function ViewGameModal() {
  const { isOpen, onClose, type, data } = useModal();
  const selectedGame = data?.game;

  if (!isOpen || type !== "viewGame" || !selectedGame) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-medium">Chi tiết game</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {selectedGame.imageUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={selectedGame.imageUrl}
                alt={selectedGame.gameNameVi}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-medium">{selectedGame.gameId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lượt thích</p>
              <p className="font-medium">❤️ {selectedGame.numLiked}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Tên game (Tiếng Việt)</p>
            <p className="font-medium">{selectedGame.gameNameVi}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Tên game (English)</p>
            <p className="font-medium">{selectedGame.gameName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">URL Game</p>
            <a 
              href={selectedGame.urlGame} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all text-sm"
            >
              {selectedGame.urlGame}
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Độ khó</p>
              <Badge className={getDifficultyColor(selectedGame.difficultyLevel)}>
                {getDifficultyLabel(selectedGame.difficultyLevel)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Thời lượng</p>
              <p className="font-medium">⏱️ {selectedGame.estimatedDuration} phút</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Chủ đề</p>
            <div className="flex flex-wrap gap-2">
              {selectedGame.topics.map(topic => (
                <Badge key={topic.topicId} variant="secondary">
                  {topic.iconUrl} {topic.topicNameVi}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Nhóm tuổi</p>
            <div className="flex flex-wrap gap-2">
              {selectedGame.ages.map(age => (
                <Badge key={age.ageId} variant="outline">
                  👶 {age.ageName}
                </Badge>
              ))}
            </div>
          </div>
          
          {selectedGame.descriptionVi && (
            <div>
              <p className="text-sm text-gray-600">Mô tả</p>
              <p className="text-gray-700 text-sm">{selectedGame.descriptionVi}</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">🎮 Preview Game</p>
            <iframe
              src={selectedGame.urlGame}
              className="w-full h-96 rounded-lg border-2 border-blue-200"
              title={selectedGame.gameNameVi}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewGameModal;

