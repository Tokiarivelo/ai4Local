'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card } from '@/app/modules/ui/card';
import { Badge } from '@/app/modules/ui/badge';
import type { CampaignChannel } from '../../../types';
import { CAMPAIGN_CHANNELS } from './constants';

interface ChannelSelectorProps {
  selectedChannels: CampaignChannel[];
  onChannelsChange: (channels: CampaignChannel[]) => void;
}

export function ChannelSelector({ selectedChannels, onChannelsChange }: ChannelSelectorProps) {
  const handleChannelToggle = React.useCallback(
    (channel: CampaignChannel) => {
      const isCurrentlySelected = selectedChannels.includes(channel);
      const newChannels = isCurrentlySelected
        ? selectedChannels.filter((c) => c !== channel)
        : [...selectedChannels, channel];

      onChannelsChange(newChannels);
    },
    [selectedChannels, onChannelsChange]
  );

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h4 className="font-medium">Canaux de distribution *</h4>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les canaux où vous souhaitez diffuser votre campagne
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {CAMPAIGN_CHANNELS.map((channel) => {
          const isSelected = selectedChannels.includes(channel.id);
          const IconComponent = channel.icon;

          return (
            <motion.div
              key={channel.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-3 border rounded-lg cursor-pointer transition-all
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => handleChannelToggle(channel.id)}
            >
              <div className="text-center">
                <div
                  className={`
                  w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-white
                  ${isSelected ? channel.color : 'bg-muted'}
                `}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium">{channel.title}</p>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Target className="h-2 w-2 text-primary-foreground" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedChannels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Canaux sélectionnés:</span>
          {selectedChannels.map((channelId) => {
            const channel = CAMPAIGN_CHANNELS.find((c) => c.id === channelId);
            return channel ? (
              <Badge key={channelId} variant="secondary" className="text-xs">
                {channel.title}
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {selectedChannels.length === 0 && (
        <p className="text-sm text-destructive mt-2">
          Veuillez sélectionner au moins un canal de distribution
        </p>
      )}
    </Card>
  );
}
