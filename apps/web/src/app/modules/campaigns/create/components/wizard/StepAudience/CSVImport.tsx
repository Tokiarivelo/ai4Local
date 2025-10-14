'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Eye } from 'lucide-react';

import { Card } from '@/app/modules/ui/card';
import { Button } from '@/app/modules/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/modules/ui/dialog';

import { mockCSVData } from '../../../mock-data';

interface CSVData {
  fileName: string;
  headers: string[];
  rowCount: number;
  validRows: number;
}

interface CSVImportProps {
  csvData?: CSVData;
  onCsvDataChange: (data?: CSVData) => void;
}

export function CSVImport({ csvData, onCsvDataChange }: CSVImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSVUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Simulation de parsing CSV
      setTimeout(() => {
        onCsvDataChange({
          fileName: file.name,
          headers: mockCSVData.headers,
          rowCount: mockCSVData.stats.totalRows,
          validRows: mockCSVData.stats.validRows,
        });
      }, 1000);

      event.target.value = '';
    },
    [onCsvDataChange]
  );

  const handleRemoveFile = React.useCallback(() => {
    onCsvDataChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onCsvDataChange]);

  return (
    <Card className="p-6">
      <h4 className="font-medium mb-4">Import d'audience</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium">Importer un fichier CSV</span>
              <span className="text-xs text-muted-foreground">Emails, noms, localisations...</span>
            </label>
          </div>
        </div>

        {csvData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{csvData.fileName}</span>
              <Button variant="outline" size="sm" onClick={handleRemoveFile} className="ml-auto">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total :</span>
                <span className="ml-2 font-medium">{csvData.rowCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Valides :</span>
                <span className="ml-2 font-medium text-green-600">{csvData.validRows}</span>
              </div>
            </div>

            <CSVPreviewDialog csvData={csvData} />
          </div>
        )}
      </div>
    </Card>
  );
}

function CSVPreviewDialog({ csvData }: { csvData: CSVData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Prévisualiser
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Prévisualisation des données</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-medium text-lg">{csvData.rowCount}</div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded">
              <div className="font-medium text-lg text-green-600">{csvData.validRows}</div>
              <div className="text-muted-foreground">Valides</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded">
              <div className="font-medium text-lg text-red-600">
                {csvData.rowCount - csvData.validRows}
              </div>
              <div className="text-muted-foreground">Erreurs</div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-2 border-b">
              <h5 className="font-medium text-sm">Échantillon des données</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {mockCSVData.headers.map((header) => (
                      <th key={header} className="px-3 py-2 text-left font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockCSVData.preview.map((row, index) => (
                    <tr key={index} className="border-t">
                      {mockCSVData.headers.map((header) => (
                        <td key={header} className="px-3 py-2">
                          {row[header as keyof typeof row]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
