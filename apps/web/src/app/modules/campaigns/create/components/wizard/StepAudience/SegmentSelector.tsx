'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check } from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import { mockAudienceSegments } from '../../../mock-data';

interface SegmentSelectorProps {
  selectedSegments: string[];
  onSegmentsChange: (segments: string[]) => void;
}

export function SegmentSelector({ selectedSegments, onSegmentsChange }: SegmentSelectorProps) {
  const toggleSegment = React.useCallback(
    (segmentId: string) => {
      const isCurrentlyActive = selectedSegments.includes(segmentId);
      const newSegments = isCurrentlyActive
        ? selectedSegments.filter((id) => id !== segmentId)
        : [...selectedSegments, segmentId];

      onSegmentsChange(newSegments);
    },
    [selectedSegments, onSegmentsChange]
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Segments disponibles</h4>
        <Badge variant="outline">
          {selectedSegments.length} sélectionné{selectedSegments.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAudienceSegments.map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            isActive={selectedSegments.includes(segment.id)}
            onToggle={() => toggleSegment(segment.id)}
          />
        ))}
      </div>
    </Card>
  );
}

const SegmentCard = React.memo(function SegmentCard({
  segment,
  isActive,
  onToggle,
}: {
  segment: (typeof mockAudienceSegments)[0];
  isActive: boolean;
  onToggle: () => void;
}) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  return (
    <motion.div
      className={`
        relative p-4 border rounded-lg cursor-pointer transition-all
        ${
          isActive
            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
            : 'border-border hover:border-primary/50'
        }
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h5 className="font-medium text-sm">{segment.name}</h5>
        </div>
        <div
          className={`
            w-4 h-4 border-2 rounded flex items-center justify-center transition-all
            ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground'
            }
          `}
        >
          {isActive && <Check className="h-3 w-3" />}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{segment.description}</p>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" size="sm">
          {segment.size.toLocaleString()} personnes
        </Badge>

        <div className="flex flex-wrap gap-1">
          {segment.demographics.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="outline" size="sm" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-2 right-2"
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
