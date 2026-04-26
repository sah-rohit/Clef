import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, X } from 'lucide-react'

const PWAReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="border-4 border-black bg-[#F9FF00] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-w-[300px]">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 uppercase">
                {offlineReady ? 'Ready to work offline' : 'Update Available'}
              </h3>
              <p className="text-sm font-medium">
                {offlineReady 
                  ? 'Clef is ready to work without an internet connection.' 
                  : 'A new version of Clef is available. Refresh to update.'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 border-2 border-black hover:bg-black hover:text-[#F9FF00]"
              onClick={close}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            {needRefresh && (
              <Button 
                onClick={() => updateServiceWorker(true)}
                className="bg-black text-[#F9FF00] border-2 border-black hover:bg-[#222] font-bold uppercase w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Now
              </Button>
            )}
            {!needRefresh && offlineReady && (
              <Button 
                onClick={close}
                className="bg-black text-[#F9FF00] border-2 border-black hover:bg-[#222] font-bold uppercase w-full"
              >
                Got it
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAReloadPrompt
