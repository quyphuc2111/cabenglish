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
          {/* Game Image */}
          {selectedGame.image_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={selectedGame.image_url}
                alt={selectedGame.game_name_vi}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          
          {/* Game ID & Likes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-medium">{selectedGame.game_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lượt thích</p>
              <p className="font-medium">❤️ {selectedGame.num_liked}</p>
            </div>
          </div>
          
          {/* Game Names */}
          <div>
            <p className="text-sm text-gray-600">Tên game (Tiếng Việt)</p>
            <p className="font-medium text-lg">{selectedGame.game_name_vi}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Tên game (English)</p>
            <p className="font-medium">{selectedGame.game_name}</p>
          </div>
          
          {/* Game URL */}
          <div>
            <p className="text-sm text-gray-600 mb-2">URL Game</p>
            <a 
              href={selectedGame.url_game} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all text-sm"
            >
              {selectedGame.url_game}
            </a>
          </div>
          
          {/* Difficulty, Duration, Status, Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Độ khó</p>
              <Badge className={getDifficultyColor(selectedGame.difficulty_level)}>
                {getDifficultyLabel(selectedGame.difficulty_level)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Thời lượng</p>
              <p className="font-medium">⏱️ {selectedGame.estimated_duration} phút</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trạng thái</p>
              <Badge className={selectedGame.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {selectedGame.is_active ? "Hoạt động" : "Vô hiệu"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Thứ tự</p>
              <p className="font-medium">{selectedGame.order}</p>
            </div>
          </div>
          
          {/* Topics */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Chủ đề</p>
            <div className="flex flex-wrap gap-2">
              {selectedGame.topics && selectedGame.topics.length > 0 ? (
                selectedGame.topics.map(topic => (
                  <Badge key={topic.topic_id} variant="secondary" className="gap-1">
                    {topic.icon_url && <span>{topic.icon_url}</span>}
                    <span>{topic.topic_name_vi}</span>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có chủ đề nào</p>
              )}
            </div>
          </div>
          
          {/* Ages */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Nhóm tuổi</p>
            <div className="flex flex-wrap gap-2">
              {selectedGame.ages && selectedGame.ages.length > 0 ? (
                selectedGame.ages.map(age => (
                  <Badge key={age.age_id} variant="outline">
                    👶 {age.age_name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có nhóm tuổi nào</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          {selectedGame.description && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Mô tả (English)</p>
              <p className="text-gray-700 text-sm">{selectedGame.description}</p>
            </div>
          )}
          
          {/* Game Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">🎮 Preview Game</p>
            <iframe
              src={selectedGame.url_game}
              className="w-full h-96 rounded-lg border-2 border-blue-200"
              title={selectedGame.game_name_vi}
              sandbox="allow-scripts allow-same-origin"
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

