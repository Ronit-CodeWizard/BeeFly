import React, { useState } from 'react';
import { LinkRecord } from '../../types';
import { Copy, Check, ExternalLink, BarChart2, Trash2, Search, Plus } from 'lucide-react';

interface MyLinksPageProps {
  links: LinkRecord[];
  onNavigateToCreate: () => void;
  onNavigateToAnalytics: (linkId: string) => void;
  onOpenShortLink: (code: string) => void;
  onDeleteLink: (linkId: string) => void;
  baseUrl: string;
}

export const MyLinksPage: React.FC<MyLinksPageProps> = ({
  links,
  onNavigateToCreate,
  onNavigateToAnalytics,
  onOpenShortLink,
  onDeleteLink,
  baseUrl
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<LinkRecord | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${baseUrl}${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredLinks = links.filter((l) => {
    if (!l) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return true;
    const short = (l.shortCode || '').toLowerCase();
    const dest = (l.destinationUrl || '').toLowerCase();
    const alias = (l.customAlias || '').toLowerCase();
    return (
      short.includes(q) ||
      dest.includes(q) ||
      alias.includes(q)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
            My Links
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your shortened links, copy short URLs, and review statistics.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 text-xs font-bold cursor-pointer self-start sm:self-auto transition-colors border-0 shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Link</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="rounded-lg skeuo-inset flex items-center px-3 py-1">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by short URL or destination..."
              className="w-full py-1 bg-transparent text-xs text-gray-900 placeholder-gray-400 outline-none font-medium"
            />
          </div>
        </div>

        <span className="text-xs text-gray-600 px-2.5 py-1 rounded skeuo-inset font-medium">
          {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
        </span>
      </div>

      {/* Links List / Table */}
      {filteredLinks.length === 0 ? (
        <div className="py-16 text-center rounded-xl skeuo-card space-y-2">
          <p className="text-sm text-gray-800 font-semibold">No links found</p>
          <p className="text-xs text-gray-400">
            {searchQuery ? 'Try clearing your search query.' : 'Create your first short link to see it here.'}
          </p>
        </div>
      ) : (
        <div className="skeuo-card rounded-xl divide-y divide-gray-100 overflow-hidden">
          {filteredLinks.map((link) => {
            const isCopied = copiedCode === link.shortCode;
            const isExpired = link.expiresAt && new Date(link.expiresAt).getTime() < Date.now();
            const fullShortUrl = `${baseUrl}${link.shortCode}`;

            return (
              <div
                key={link.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                {/* Info Left with Click-to-Copy on the short link */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Click-to-copy badge for the short link */}
                    <button
                      type="button"
                      onClick={() => handleCopy(link.shortCode)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-yellow-100 text-yellow-900 border-yellow-300 ring-2 ring-yellow-200'
                          : 'skeuo-btn text-gray-900 hover:border-gray-400'
                      }`}
                      title="Click to copy full shortened link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-yellow-700" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      <span className="font-semibold font-mono">{fullShortUrl}</span>
                      <span className="text-[10px] text-gray-600 ml-0.5 font-medium">
                        {isCopied ? 'Copied' : 'Copy'}
                      </span>
                    </button>

                    {isExpired ? (
                      <span className="text-[11px] uppercase px-2 py-0.5 rounded skeuo-inset text-gray-400 font-medium">
                        Expired
                      </span>
                    ) : (
                      <span className="text-[11px] uppercase px-2 py-0.5 rounded skeuo-inset text-yellow-800 font-medium bg-yellow-50/50">
                        Active
                      </span>
                    )}

                    <span className="text-xs text-gray-400">
                      Created {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 truncate max-w-xl">
                    → <span className="text-gray-500">Destination:</span> {link.destinationUrl}
                  </p>
                </div>

                {/* Actions Right */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <span className="text-xs text-gray-500">
                    <strong className="text-gray-900 font-semibold">{link.clicks.toLocaleString()}</strong> clicks
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(link.shortCode)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isCopied 
                          ? 'skeuo-btn-green' 
                          : 'skeuo-btn text-gray-700'
                      }`}
                      title="Copy full short link"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    {/* Open Button */}
                    <button
                      onClick={() => onOpenShortLink(link.shortCode)}
                      className="p-1.5 rounded-md skeuo-btn text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                      title="Open and test redirect flow"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Analytics */}
                    <button
                      onClick={() => onNavigateToAnalytics(link.id)}
                      className="p-1.5 rounded-md skeuo-btn text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                      title="View click analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setLinkToDelete(link)}
                      className="p-1.5 rounded-md skeuo-btn text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {linkToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-xl skeuo-card space-y-4 shadow-2xl">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Delete this link?
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                This action cannot be undone. Visitors using <code className="text-gray-800 font-semibold">/{linkToDelete.shortCode}</code> will encounter a 404 page.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLinkToDelete(null)}
                className="px-4 py-2 rounded-md skeuo-btn text-gray-700 hover:text-gray-900 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteLink(linkToDelete.id);
                  setLinkToDelete(null);
                }}
                className="px-4 py-2 rounded-md skeuo-btn-red text-white text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
