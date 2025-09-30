import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ShoppingBag, Users, Heart, Play, Music, Star, Megaphone } from 'lucide-react';
import { mockData } from '@/data/mockData';

interface BrandDashboardProps {
  brand?: string;
}

const BrandDashboard: React.FC<BrandDashboardProps> = ({ brand = "Nike" }) => {
  const getContentTypeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      product: ShoppingBag,
      video: Play,
      music_release: Music,
      campaign: Megaphone,
      brand_endorsement: Star
    };
    const Icon = iconMap[type] || ShoppingBag;
    return <Icon className="w-4 h-4" />;
  };

  const brandData = {
    Nike: {
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
      description: "Global leader in athletic footwear, apparel, and equipment",
      categories: ["Footwear", "Apparel", "Equipment", "Innovation"],
      topProducts: [
        { name: "Air Zoom Pegasus 40", category: "Running", engagement: 95 },
        { name: "Air Force 1 '07", category: "Lifestyle", engagement: 88 },
        { name: "Dri-FIT ADV Techknit Ultra", category: "Apparel", engagement: 87 },
        { name: "Tech Fleece Hoodie", category: "Apparel", engagement: 82 },
        { name: "Yoga Dri-FIT Pants", category: "Apparel", engagement: 79 }
      ],
      campaigns: [
        { name: "Just Do It: The Power of Sport", sentiment: "positive", reach: "Global", engagement: 92 },
        { name: "Why Do It? Connecting with the Next Generation", sentiment: "positive", reach: "Youth", engagement: 87 },
        { name: "Winning Isn't for Everyone: Celebrating Effort", sentiment: "positive", reach: "Athletes", engagement: 89 }
      ],
      metrics: {
        totalContent: 156,
        avgEngagement: 87,
        trendingScore: 94,
        brandSentiment: "positive"
      },
      partnerships: [
        { name: "iShowSpeed Collaboration", type: "Gaming", status: "Active" },
        { name: "BLACKPINK Fashion Campaign", type: "Music", status: "Active" }
      ]
    },
    iShowSpeed: {
      logo: "https://yt3.googleusercontent.com/ytc/APkrFKZWeMCsx4Q9e_Hm6nhOOUQ3fv96QGUXiMa1pPP=s176-c-k-c0x00ffffff-no-rj",
      description: "Popular gaming streamer and content creator known for FIFA gameplay",
      categories: ["Gaming", "Entertainment", "Sports", "Reactions"],
      topContent: [
        { name: "Reacting to Viral TikToks", category: "Reactions", engagement: 91 },
        { name: "FIFA 25 Gameplay Highlights", category: "Gaming", engagement: 89 },
        { name: "My Trip to Japan Vlog", category: "Travel", engagement: 85 }
      ],
      collaborations: [
        { name: "Nike Partnership", sentiment: "positive", reach: "Global", engagement: 87 },
        { name: "FIFA Content Creator", sentiment: "positive", reach: "Gaming", engagement: 93 }
      ],
      metrics: {
        totalContent: 89,
        avgEngagement: 88,
        trendingScore: 91,
        brandSentiment: "positive"
      },
      partnerships: [
        { name: "Nike Collaboration", type: "Brand", status: "Active" },
        { name: "YouTube Creator", type: "Platform", status: "Active" }
      ]
    },
    BLACKPINK: {
      logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Blackpink_-_Born_Pink.png",
      description: "Global K-pop sensation and fashion icon",
      categories: ["Music", "Fashion", "Entertainment", "Culture"],
      topReleases: [
        { name: "Pink Venom (Single)", category: "Single", engagement: 98 },
        { name: "BORN PINK (Album)", category: "Album", engagement: 96 },
        { name: "THE ALBUM (Album)", category: "Album", engagement: 94 },
        { name: "Jennie for Chanel", category: "Fashion", engagement: 93 },
        { name: "Lisa for Celine", category: "Fashion", engagement: 91 }
      ],
      campaigns: [
        { name: "BORN PINK World Tour", sentiment: "positive", reach: "Global", engagement: 97 },
        { name: "Nike Fashion Partnership", sentiment: "positive", reach: "Fashion", engagement: 93 }
      ],
      metrics: {
        totalContent: 124,
        avgEngagement: 94,
        trendingScore: 98,
        brandSentiment: "positive"
      },
      partnerships: [
        { name: "Nike Fashion Campaign", type: "Fashion", status: "Active" },
        { name: "YG Entertainment", type: "Music", status: "Active" }
      ]
    }
  };

  const data = brandData[brand as keyof typeof brandData];
  const brandContent = mockData.filter(item => item.brandOrPerson === brand);

  if (!data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Brand Not Found</h2>
        <p className="text-gray-600">Please select a valid brand from the navigation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={data.logo} 
              alt={`${brand} logo`} 
              className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-2" 
            />
            <div>
              <h2 className="text-2xl font-bold">{brand}</h2>
              <p className="text-gray-600">{data.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.categories.map((category, index) => (
                  <Badge key={index} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{data.metrics.totalContent}</div>
            <div className="text-sm text-gray-600">Total Content Items</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{data.metrics.avgEngagement}%</div>
            <div className="text-sm text-gray-600">Avg Engagement</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{data.metrics.trendingScore}</div>
            <div className="text-sm text-gray-600">Trending Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold capitalize">{data.metrics.brandSentiment}</div>
            <div className="text-sm text-gray-600">Brand Sentiment</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brand === "Nike" && data.topProducts?.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{product.engagement}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            ))}
            
            {brand === "iShowSpeed" && data.topContent?.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Play className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">{content.name}</div>
                    <Badge variant="secondary">{content.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{content.engagement}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            ))}
            
            {brand === "BLACKPINK" && data.topReleases?.map((release, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">{release.name}</div>
                    <Badge variant="secondary">{release.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{release.engagement}%</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns/Collaborations */}
      <Card>
        <CardHeader>
          <CardTitle>
            {brand === "Nike" ? "Active Campaigns" : brand === "iShowSpeed" ? "Collaborations" : "Campaigns"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.campaigns || data.collaborations)?.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-medium">{item.name}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={item.sentiment === 'positive' ? 'default' : 'secondary'}>
                    {item.sentiment}
                  </Badge>
                  <span className="text-sm text-gray-600">Reach: {item.reach}</span>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Engagement: </span>
                  <span className="font-medium text-green-600">{item.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brandContent.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  {getContentTypeIcon(item.contentType)}
                  <Badge variant="outline" className="capitalize">
                    {item.contentType.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{item.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">{item.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{item.engagementScore}%</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.datePublished).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partnerships */}
      <Card>
        <CardHeader>
          <CardTitle>Active Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.partnerships.map((partnership, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{partnership.name}</div>
                  <Badge variant="outline">{partnership.type}</Badge>
                </div>
                <Badge variant="default">{partnership.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandDashboard;
