
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  upvotes: number;
}

export function HelpRequestList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('help_requests')
          .select(`
            *,
            help_upvotes (
              count
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setRequests(data.map(request => ({
          ...request,
          upvotes: request.help_upvotes?.[0]?.count || 0
        })));
      } catch (error) {
        console.error('Error fetching help requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Help Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-4">
              <h3 className="font-semibold">{request.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {request.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {request.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Posted {new Date(request.created_at).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm">
                  {request.upvotes} upvotes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
