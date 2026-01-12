import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Table2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const tableNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

const QRCodes = () => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const baseUrl = window.location.origin;

  const toggleTable = (tableNum: string) => {
    setSelectedTables(prev => 
      prev.includes(tableNum) 
        ? prev.filter(t => t !== tableNum)
        : [...prev, tableNum]
    );
  };

  const selectAll = () => {
    setSelectedTables(tableNumbers);
  };

  const clearSelection = () => {
    setSelectedTables([]);
  };

  const downloadQR = (tableNum: string) => {
    const svg = document.getElementById(`qr-${tableNum}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 500;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 300, 300);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Table ${tableNum}`, canvas.width / 2, 420);
        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText('Scan to Order', canvas.width / 2, 455);
      }
      
      const link = document.createElement('a');
      link.download = `bistro17-table-${tableNum}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const printSelected = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrCodes = selectedTables.length > 0 ? selectedTables : tableNumbers;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bistro@17 QR Codes</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; }
            .page { 
              page-break-after: always; 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center;
              height: 100vh;
              padding: 2rem;
            }
            .page:last-child { page-break-after: auto; }
            .qr-container {
              border: 3px solid #2d5a27;
              border-radius: 24px;
              padding: 3rem;
              text-align: center;
              background: white;
            }
            .logo { font-size: 2rem; font-weight: bold; color: #2d5a27; margin-bottom: 1.5rem; }
            .table-num { font-size: 2.5rem; font-weight: bold; margin-top: 1.5rem; }
            .subtitle { color: #666; margin-top: 0.5rem; font-size: 1.2rem; }
            svg { display: block; margin: 0 auto; }
            @media print {
              .page { height: 100vh; }
            }
          </style>
        </head>
        <body>
    `);

    qrCodes.forEach(tableNum => {
      const url = `${baseUrl}/order?table=${tableNum}`;
      printWindow.document.write(`
        <div class="page">
          <div class="qr-container">
            <div class="logo">☕ Bistro@17</div>
            <svg id="print-qr-${tableNum}" width="250" height="250"></svg>
            <div class="table-num">Table ${tableNum}</div>
            <div class="subtitle">Scan to Order</div>
          </div>
        </div>
      `);
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Generate QR codes in print window
    setTimeout(() => {
      qrCodes.forEach(tableNum => {
        const url = `${baseUrl}/order?table=${tableNum}`;
        const container = printWindow.document.getElementById(`print-qr-${tableNum}`);
        if (container) {
          // Simple QR placeholder - in real implementation, use a library
          container.innerHTML = `
            <rect width="250" height="250" fill="white" stroke="#2d5a27" stroke-width="2"/>
            <text x="125" y="125" text-anchor="middle" font-size="12" fill="#2d5a27">
              ${url}
            </text>
          `;
        }
      });
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                  <Table2 className="w-8 h-8 text-primary" />
                  Table QR Codes
                </h1>
                <p className="text-muted-foreground mt-2">
                  Generate and print QR codes for each table. Customers scan to auto-fill their table number.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="outline" onClick={clearSelection}>
                  Clear
                </Button>
                <Button onClick={printSelected} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print {selectedTables.length > 0 ? `(${selectedTables.length})` : 'All'}
                </Button>
              </div>
            </div>

            {/* QR Code Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {tableNumbers.map((tableNum) => {
                const orderUrl = `${baseUrl}/order?table=${tableNum}`;
                const isSelected = selectedTables.includes(tableNum);
                
                return (
                  <Card 
                    key={tableNum}
                    className={`p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleTable(tableNum)}
                  >
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <QRCodeSVG
                        id={`qr-${tableNum}`}
                        value={orderUrl}
                        size={150}
                        level="H"
                        includeMargin
                        fgColor="#2d5a27"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-1">
                      Table {tableNum}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 break-all">
                      {orderUrl}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadQR(tableNum);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCodes;
